package core.exec;

import com.sun.jdi.ThreadReference;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.ThreadDeathEvent;
import com.sun.jdi.event.ThreadStartEvent;
import com.sun.jdi.event.VMDeathEvent;
import com.sun.jdi.request.EventRequest;
import com.sun.jdi.request.StepRequest;
import com.sun.tools.jdi.VirtualMachineManagerImpl;
import core.Project;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Executes a compiled project.
 */
public class Executor {
    private Project project;
    private VirtualMachine vm;

    /**
     * Initializes the executor with the received project, it shall be already compiled.
     */
    public Executor(Project project) {
        this.project = project;
    }

    public boolean isRunning() {
        return vm != null;
    }

    public Project getProject() {
        return project;
    }

    /**
     * Executes the received project.
     */
    public void execute() throws VMStartException, IllegalConnectorArgumentsException, IOException, InterruptedException {
        startVirtualMachine();

        var defaultThreads = List.copyOf(vm.allThreads());
        var mainThread = defaultThreads.stream()
                .filter(t -> t.name().equals("main"))
                .findFirst()
                .orElseThrow(() -> new NullPointerException("main thread not found"));
        var allowedThreadNames = defaultThreads.stream()
                .map(ThreadReference::name)
                .collect(Collectors.toCollection(HashSet::new));
        allowedThreadNames.addAll(Set.of("Common-Cleaner", "DestroyJavaVM"));

        var vmDeathRequest = vm.eventRequestManager().createVMDeathRequest();

        var threadStartRequest = vm.eventRequestManager().createThreadStartRequest();
        threadStartRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        var threadDeathRequest = vm.eventRequestManager().createThreadDeathRequest();
        threadDeathRequest.setSuspendPolicy(EventRequest.SUSPEND_NONE);

        var methodEntryRequest = vm.eventRequestManager().createMethodEntryRequest();
        methodEntryRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        methodEntryRequest.addClassFilter(project.getMainClass());
        methodEntryRequest.addThreadFilter(mainThread);

        var methodExitRequest = vm.eventRequestManager().createMethodExitRequest();
        methodExitRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        methodExitRequest.addClassFilter(project.getMainClass());
        methodExitRequest.addThreadFilter(mainThread);

        var stepRequest = vm.eventRequestManager().createStepRequest(
                mainThread, StepRequest.STEP_MIN, StepRequest.STEP_INTO
        );
        stepRequest.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        stepRequest.addClassFilter(project.getMainClass());

        vmDeathRequest.enable();
        threadStartRequest.enable();
        threadDeathRequest.enable();
        methodEntryRequest.enable();
        methodExitRequest.enable();
        stepRequest.enable();

        while (true) {
            vm.resume();
            var eventSet = vm.eventQueue().remove();
            System.out.println(eventSet.stream().toArray());
            for (var event : eventSet) {
                System.out.println(event.getClass().getName());
                if (event instanceof ThreadStartEvent) {
                    var threadStartEvent = (ThreadStartEvent) event;
                    if (!allowedThreadNames.contains(threadStartEvent.thread().name()))
                        threadStartEvent.thread().interrupt();
                    System.out.println(((ThreadStartEvent) event).thread().name());
                }
                if (event instanceof ThreadDeathEvent) {
                    System.out.println(((ThreadDeathEvent) event).thread().name());
                }
                if (event instanceof VMDeathEvent) {
                    return;
                }
            }
        }
    }

    /**
     * Returns a virtual machine reference running the project.
     */
    private void startVirtualMachine() throws IOException, IllegalConnectorArgumentsException, VMStartException {
        if (!project.isCompiled()) throw new IllegalStateException("project not compiled");
        if (isRunning()) throw new IllegalStateException("executor already running");

        var vmm = VirtualMachineManagerImpl.virtualMachineManager();
        var connector = vmm.defaultConnector();

        var connectorArguments = connector.defaultArguments();
        connectorArguments.get(ConnectorArguments.SUSPEND.arg).setValue("true");
        connectorArguments.get(ConnectorArguments.OPTIONS.arg).setValue(
                "-cp \"" + project.getBinPath().toAbsolutePath().toString() + "\""
        );
        connectorArguments.get(ConnectorArguments.MAIN.arg).setValue(
                project.getFilename().substring(0, project.getFilename().lastIndexOf('.'))
        );

        vm = connector.launch(connectorArguments);
    }
}
