package core.tracer;

import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.Connector;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.tools.jdi.VirtualMachineManagerImpl;

import java.io.IOException;
import java.util.Map;

/**
 * Executes a compiled project.
 */
public class Executor {
    private Project project;

    /**
     * Initializes the executor with the received project, it shall be already compiled.
     */
    public Executor(Project project) {
        this.project = project;
    }

    /**
     * Returns a virtual machine reference running the project.
     */
    public VirtualMachine execute() throws IOException, IllegalConnectorArgumentsException, VMStartException {
        if (!project.isCompiled()) throw new IllegalStateException("project not compiled");

        var vmm = VirtualMachineManagerImpl.virtualMachineManager();
        var connector = vmm.defaultConnector();

        Map<String, Connector.Argument> connectorArguments = connector.defaultArguments();
        connectorArguments.get(ConnectorArguments.SUSPEND.arg).setValue("true");
        connectorArguments.get(ConnectorArguments.OPTIONS.arg).setValue(
                "-cp \"" + project.getBinPath().toAbsolutePath().toString() + "\""
        );
        connectorArguments.get(ConnectorArguments.MAIN.arg).setValue(
                project.getFilename().substring(0, project.getFilename().lastIndexOf('.'))
        );

        return connector.launch(connectorArguments);
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
