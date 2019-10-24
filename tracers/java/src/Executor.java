import com.sun.jdi.ThreadReference;
import com.sun.jdi.VMDisconnectedException;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.Event;
import com.sun.jdi.event.EventSet;
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
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Executes a compiled project.
 */
class Executor {

    void execute(Path path, String filename, LambdaUtils.ConsumerT<Event> trace, Supplier<String> inputHook, LambdaUtils.ConsumerT<String> printHook, LambdaUtils.ConsumerT<String> lockHook) throws Exception {
        VirtualMachine fvm = null;
        try {
            var vm = fvm = launchVirtualMachine(path, filename);
            var allowedThreads = configureEventRequests(vm, path);
            var vmStdin = vm.process().getOutputStream();
            var vmStdout = vm.process().getInputStream();
            var vmStderr = vm.process().getErrorStream();
            vmStdin.write(inputHook.get().getBytes());
            vmStdin.flush();
            var disconnected = new boolean[]{false};
            var locked = new boolean[]{false};
            IntStream.generate(() -> 0)
                    .peek(i -> vm.resume())
                    .boxed()
                    .map(LambdaUtils.asFunction(i -> vm.eventQueue().remove(1000)))
                    .takeWhile(eventSet -> !locked[0])
                    .peek(eventSet -> locked[0] = eventSet == null)
                    .flatMap(EventSet::stream)
                    .peek(event -> {
                        if (event instanceof ThreadStartEvent && !allowedThreads.contains(((ThreadStartEvent) event).thread().name())
                        ) ((ThreadStartEvent) event).thread().interrupt();
                    })
                    .peek(event -> disconnected[0] = event instanceof VMDisconnectEvent)
                    .takeWhile(event -> !disconnected[0])
                    .forEach(LambdaUtils.asConsumer(event -> {
                        var printAvailable = vmStdout.available();
                        var errorAvailable = vmStderr.available();
                        if (printAvailable > 0) printHook.accept(new String(vmStdout.readNBytes(printAvailable)));
                        if (errorAvailable > 0) printHook.accept(new String(vmStderr.readNBytes(errorAvailable)));
                        trace.accept(event);
                    }));
            if (locked[0]) lockHook.accept(null);
        } catch (Exception e) {
            // exceptions may be from vm initialization or IO operations or runtime exceptions that came from the stream
            // containing any tracer or traced program exceptions
            throw !(e instanceof RuntimeException) | e.getCause() == null ? e : ((Exception) e.getCause());
        } finally {
            try {
                if (fvm != null) fvm.exit(0);
            } catch (VMDisconnectedException e) {
                // throws this exceptions if the vm is already disconnected
            }
        }
    }

    private VirtualMachine launchVirtualMachine(Path path, String filename) throws IllegalConnectorArgumentsException, IOException, VMStartException {
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

        var methodEntryRequests = classNames
                .stream()
                .map(className -> {
                    var methodEntryRequest = vm.eventRequestManager().createMethodEntryRequest();
                    methodEntryRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodEntryRequest.addThreadFilter(mainThread);
                    methodEntryRequest.addClassFilter(className);
                    return methodEntryRequest;
                })
                .collect(Collectors.toList());

        var methodExitRequests = classNames
                .stream()
                .map(className -> {
                    var methodExitRequest = vm.eventRequestManager().createMethodExitRequest();
                    methodExitRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    methodExitRequest.addThreadFilter(mainThread);
                    methodExitRequest.addClassFilter(className);
                    return methodExitRequest;
                })
                .collect(Collectors.toList());

        var stepRequests = classNames
                .stream()
                .map(className -> {
                    var stepRequest = vm
                            .eventRequestManager()
                            .createStepRequest(mainThread, StepRequest.STEP_LINE, StepRequest.STEP_INTO);
                    stepRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    stepRequest.addClassFilter(className);
                    return stepRequest;
                })
                .collect(Collectors.toList());

        var exceptionRequests = classNames
                .stream()
                .map(className -> {
                    var exceptionRequest = vm.eventRequestManager().createExceptionRequest(null, true, true);
                    exceptionRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
                    exceptionRequest.addClassFilter(className);
                    return exceptionRequest;
                })
                .collect(Collectors.toList());

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

    static class LambdaUtils {

        static <T, U> Function<T, U> asFunction(FunctionT<T, U> functionT) {
            return (T argument) -> {
                try {
                    return functionT.apply(argument);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            };
        }

        static <T> Consumer<T> asConsumer(ConsumerT<T> consumerT) {
            return (T argument) -> {
                try {
                    consumerT.accept(argument);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            };
        }

        @FunctionalInterface
        interface FunctionT<T, U> {
            U apply(T argument) throws Exception;
        }

        @FunctionalInterface
        interface ConsumerT<T> {
            void accept(T argument) throws Exception;
        }
    }
}
