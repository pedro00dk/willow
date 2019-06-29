import com.sun.jdi.ThreadReference;
import com.sun.jdi.VMDisconnectedException;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.Event;
import com.sun.jdi.event.ThreadStartEvent;
import com.sun.jdi.event.VMDisconnectEvent;
import com.sun.jdi.request.EventRequest;
import com.sun.jdi.request.StepRequest;
import com.sun.tools.jdi.VirtualMachineManagerImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * Executes a compiled project.
 */
class Executor {

    void execute(Path path, String filename, Consumer<Event> trace, Supplier<String> inputHook, Consumer<String> printHook, Consumer<String> lockHook) throws Exception {
        VirtualMachine vm = null;
        var vmDisconnected = false;
        try {
            vm = startVirtualMachine(path, filename);
            var allowedThreads = configureEventRequests(vm, path);

            var vmStdin = vm.process().getOutputStream();
            var vmStdout = vm.process().getInputStream();
            var vmStderr = vm.process().getErrorStream();

            vmStdin.write(inputHook.get().getBytes());
            vmStdin.flush();

            while (!vmDisconnected) {
                vm.resume();
                var eventSet = vm.eventQueue().remove(1000);
                if (eventSet == null) {
                    lockHook.accept("");
                    break;
                }
                for (var event : eventSet) {
                    // interrupt not allowed threads
                    if (event instanceof ThreadStartEvent && !allowedThreads.contains(((ThreadStartEvent) event).thread().name())
                    ) ((ThreadStartEvent) event).thread().interrupt();

                    // check if is last event (if call eventQueue again, it throws an VMDisconnectedException)
                    if (event instanceof VMDisconnectEvent) vmDisconnected = true;

                    // print hooks
                    var printAvailable = vmStdout.available();
                    if (printAvailable > 0) printHook.accept(new String(vmStdout.readNBytes(printAvailable)));
                    var errorAvailable = vmStderr.available();
                    if (errorAvailable > 0) printHook.accept(new String(vmStderr.readNBytes(errorAvailable)));

                    trace.accept(event);
                }
            }
        } catch (RuntimeException e) {
            // controlled error that came from the trace function and hooks of unchecked errors from anywhere
            var cause = (Exception) e.getCause();
            throw cause != null ? cause : e;
        } catch (Exception e) {
            // internal errors from executor
            throw e;
        } finally {
            try {
                if (vm != null) vm.exit(0);
            } catch (VMDisconnectedException e) {
                // throws this exceptions if the vm is already disconnected
            }
        }
    }

    private VirtualMachine startVirtualMachine(Path path, String filename) throws IOException, IllegalConnectorArgumentsException, VMStartException {
        var binPath = Paths.get(path.toString(), "bin/");
        var vmm = VirtualMachineManagerImpl.virtualMachineManager();
        var connector = vmm.defaultConnector();
        var connectorArguments = connector.defaultArguments();
        connectorArguments.get("suspend").setValue("true");
        connectorArguments.get("options").setValue("-cp \"" + binPath.toAbsolutePath().toString() + "\"");
        connectorArguments.get("main").setValue(filename.substring(0, filename.indexOf('.')));
        return connector.launch(connectorArguments);
    }

    private Set<String> configureEventRequests(VirtualMachine vm, Path path) {
        var defaultThreads = List.copyOf(vm.allThreads());
        var mainThread = defaultThreads
                .stream()
                .filter(t -> t.name().equals("main"))
                .findFirst()
                .orElseThrow(() -> new NullPointerException("main thread not found"));
        var allowedThreadsNames = defaultThreads
                .stream()
                .map(ThreadReference::name)
                .collect(Collectors.toCollection(HashSet::new));
        allowedThreadsNames.addAll(Set.of("Common-Cleaner", "DestroyJavaVM"));

        var vmDeathRequest = vm.eventRequestManager().createVMDeathRequest();

        var threadStartRequest = vm.eventRequestManager().createThreadStartRequest();
        threadStartRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        var threadDeathRequest = vm.eventRequestManager().createThreadDeathRequest();
        threadDeathRequest.setSuspendPolicy(EventRequest.SUSPEND_NONE);

        var classNames = getProjectClasses(path);

        var methodEntryRequests = classNames //
                .stream()
                .map(c -> {
                    var methodEntryRequest = vm.eventRequestManager().createMethodEntryRequest();
                    methodEntryRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodEntryRequest.addThreadFilter(mainThread);
                    methodEntryRequest.addClassFilter(c);
                    return methodEntryRequest;
                })
                .collect(Collectors.toList());

        var methodExitRequests = classNames //
                .stream()
                .map(c -> {
                    var methodExitRequest = vm.eventRequestManager().createMethodExitRequest();
                    methodExitRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodExitRequest.addThreadFilter(mainThread);
                    methodExitRequest.addClassFilter(c);
                    return methodExitRequest;
                })
                .collect(Collectors.toList());

        var stepRequests = classNames //
                .stream()
                .map(c -> {
                    var stepRequest = vm
                            .eventRequestManager()
                            .createStepRequest(mainThread, StepRequest.STEP_LINE, StepRequest.STEP_INTO);
                    stepRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    stepRequest.addClassFilter(c);
                    return stepRequest;
                })
                .collect(Collectors.toList());

        var exceptionRequests = classNames //
                .stream()
                .map(c -> {
                    var exceptionRequest = vm.eventRequestManager().createExceptionRequest(null, true, true);
                    exceptionRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    exceptionRequest.addClassFilter(c);
                    return exceptionRequest;
                })
                .collect(Collectors.toList());

        // TODO implement step into try blocks

        vmDeathRequest.enable();
        threadStartRequest.enable();
        threadDeathRequest.enable();
        methodEntryRequests.forEach(EventRequest::enable);
        methodExitRequests.forEach(EventRequest::enable);
        stepRequests.forEach(EventRequest::enable);
        exceptionRequests.forEach(EventRequest::enable);

        return allowedThreadsNames;
    }

    private List<String> getProjectClasses(Path path) {
        var binPath = Paths.get(path.toString(), "bin/");
        try {
            return Files
                    .list(binPath)
                    .map(p -> p.getFileName().toString())
                    .map(s -> s.substring(0, s.lastIndexOf('.')))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }
}
