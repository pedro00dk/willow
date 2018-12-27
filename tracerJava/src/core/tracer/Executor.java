package core.tracer;

import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.request.EventRequest;
import com.sun.tools.jdi.VirtualMachineManagerImpl;

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

    public void execute() throws VMStartException, IllegalConnectorArgumentsException, IOException, InterruptedException {
        startVirtualMachine();
        //vm.version();
        while(true) {
            var eventSet = vm.eventQueue().remove();
            eventSet.forEach(e -> System.out.println(e.getClass().getName()));
            eventSet.resume();
        }
    }
}

/**
 * Virtual machine connector arguments.
 */
enum ConnectorArguments {
    HOME("home"),
    OPTIONS("options"),
    MAIN("main"),
    SUSPEND("suspend"),
    QUOTE("quote"),
    EXEC("vmexec"),
    CWD("cwd"),
    ENV("env"),
    HOSTNAME("hostname"),
    PORT("port"),
    TIMEOUT("timeout");

    final String arg;

    ConnectorArguments(String arg) {
        this.arg = arg;
    }
}
