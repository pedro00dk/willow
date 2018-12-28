package core.exec;

import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.MethodEntryEvent;
import com.sun.jdi.request.EventRequest;
import com.sun.tools.jdi.VirtualMachineManagerImpl;
import core.Project;

import java.io.IOException;

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

    /**
     * Stops the execution when the program reaches the main method.
     */
    private MethodEntryEvent stopOnMain() throws InterruptedException {
        var manager = vm.eventRequestManager();
        var request = manager.createMethodEntryRequest();
        request.addClassFilter(project.getMainClass());
        request.setSuspendPolicy(EventRequest.SUSPEND_EVENT_THREAD);
        request.enable();
        vm.resume();
        while (true) for (var event : vm.eventQueue().remove()) {
            if (event instanceof MethodEntryEvent) {
                var methodEvent = (MethodEntryEvent) event;
                var method = methodEvent.method();
                if (method.isPublic() && method.isStatic() && method.name().equals("main") &&
                        method.signature().equals("([Ljava/lang/String;)V")) {
                    request.disable();
                    return methodEvent;
                }
            }
        }
    }

    public void execute() throws VMStartException, IllegalConnectorArgumentsException, IOException, InterruptedException {
        startVirtualMachine();
        var startEvent = stopOnMain();
        var mainThread = startEvent.thread();

        vm.resume();

        while (true) {
            var eventSet = vm.eventQueue().remove();
            for (var event : eventSet) {
                System.out.println(event.getClass().getName());
            }
        }
    }


}
