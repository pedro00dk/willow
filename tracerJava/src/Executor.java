import com.sun.jdi.ThreadReference;
import com.sun.jdi.VMDisconnectedException;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.ThreadStartEvent;
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
import java.util.stream.Collectors;

/**
 * Executes a compiled project.
 */
public class Executor {
    private Path path;
    private String filename;
    private TraceProcessor traceProcessor;
    private VirtualMachine vm;

    public Executor(Path path, String filename, TraceProcessor traceProcessor) {
        this.path = path;
        this.filename = filename;
        this.traceProcessor = traceProcessor;
    }

    public void execute() throws Exception {
        startVirtualMachine();
        var allowedThreadsNames = configureEventRequests();

        var vmStdin = vm.process().getOutputStream();
        var vmStdout = vm.process().getInputStream();
        var vmStderr = vm.process().getErrorStream();

        vmStdin.write(traceProcessor.getInput());

        boolean continueTracing = true;
        try {
            while (continueTracing) {
                vm.resume();
                var eventSet = vm.eventQueue().remove(1000);
                if (eventSet == null) {
                    continueTracing = traceProcessor.onLocked("not enough input or slow function call");
                    if (continueTracing) continue;
                    break;
                }
                for (var event : eventSet) {
                    // interrupt not allowed threads
                    if (event instanceof ThreadStartEvent &&
                            !allowedThreadsNames.contains(((ThreadStartEvent) event).thread().name()))
                        ((ThreadStartEvent) event).thread().interrupt();

                    // print hooks
                    var printAvailable = vmStdout.available();
                    if (printAvailable > 0)
                        traceProcessor.printHook(new String(vmStdout.readNBytes(printAvailable)));
                    var errorAvailable = vmStderr.available();
                    if (errorAvailable > 0)
                        traceProcessor.printHook(new String(vmStderr.readNBytes(errorAvailable)));

                    // trace
                    continueTracing = traceProcessor.trace(event);
                    if (!continueTracing) {
                        // throws precipitated VMDisconnectedException on next queue.remove call
                        vm.exit(0);
                        // breaks only internal loop to stop the eventSet iterator
                        break;
                    }
                }
            }
        } catch (VMDisconnectedException e) {
            if (continueTracing) throw new RuntimeException(e);
        }
    }

    private void startVirtualMachine() throws IOException, IllegalConnectorArgumentsException, VMStartException {
        if (vm != null) throw new IllegalStateException("executor already running");
        var srcPath = Paths.get(path.toString(), "src/");
        var binPath = Paths.get(path.toString(), "bin/");
        var vmm = VirtualMachineManagerImpl.virtualMachineManager();
        var connector = vmm.defaultConnector();
        var connectorArguments = connector.defaultArguments();
        connectorArguments.get("suspend").setValue("true");
        connectorArguments.get("options").setValue("-cp \"" + binPath.toAbsolutePath().toString() + "\"");
        connectorArguments.get("main").setValue(filename.substring(0, filename.indexOf('.')));
        vm = connector.launch(connectorArguments);
    }

    private Set<String> configureEventRequests() {
        var defaultThreads = List.copyOf(vm.allThreads());
        var mainThread = defaultThreads.stream()
                .filter(t -> t.name().equals("main"))
                .findFirst()
                .orElseThrow(() -> new NullPointerException("main thread not found"));
        var allowedThreadsNames = defaultThreads.stream()
                .map(ThreadReference::name)
                .collect(Collectors.toCollection(HashSet::new));
        allowedThreadsNames.addAll(Set.of("Common-Cleaner", "DestroyJavaVM"));

        var vmDeathRequest = vm.eventRequestManager().createVMDeathRequest();

        var threadStartRequest = vm.eventRequestManager().createThreadStartRequest();
        threadStartRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        var threadDeathRequest = vm.eventRequestManager().createThreadDeathRequest();
        threadDeathRequest.setSuspendPolicy(EventRequest.SUSPEND_NONE);

        var classNames = getProjectClasses(path);

        var methodEntryRequests = classNames.stream()
                .map(c -> {
                    var methodEntryRequest = vm.eventRequestManager().createMethodEntryRequest();
                    methodEntryRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodEntryRequest.addThreadFilter(mainThread);
                    methodEntryRequest.addClassFilter(c);
                    return methodEntryRequest;
                })
                .collect(Collectors.toList());

        var methodExitRequests = classNames.stream()
                .map(c -> {
                    var methodExitRequest = vm.eventRequestManager().createMethodExitRequest();
                    methodExitRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodExitRequest.addThreadFilter(mainThread);
                    methodExitRequest.addClassFilter(c);
                    return methodExitRequest;
                })
                .collect(Collectors.toList());

        var stepRequests = classNames.stream()
                .map(c -> {
                    var stepRequest = vm.eventRequestManager()
                            .createStepRequest(mainThread, StepRequest.STEP_LINE, StepRequest.STEP_INTO);
                    stepRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    stepRequest.addClassFilter(c);
                    return stepRequest;
                })
                .collect(Collectors.toList());

        var exceptionRequests = classNames.stream()
                .map(c -> {
                    var exceptionRequest = vm.eventRequestManager()
                            .createExceptionRequest(null, true, true);
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
            return Files.list(binPath)
                    .map(p -> p.getFileName().toString())
                    .map(s -> s.substring(0, s.lastIndexOf('.')))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }
}
