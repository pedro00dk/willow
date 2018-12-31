package core;

import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import core.exec.Executor;

import java.io.IOException;
import java.util.Queue;

/**
 * Traces a java file and analyses its state after every instruction.
 */
public class Tracer {
    private Project project;

    /**
     * Initializes the tracer with the java filename and its contents.
     */
    public Tracer(String filename, String code) {
        this.project = new Project(filename, code);
    }

    /**
     * Configures and runs the tracer.
     */
    public void run() {
        var eventProcessor = new EventProcessor();
        try {
            project.generate();
            project.compile();
            new Executor(project, eventProcessor).execute();

        } catch (IOException | IllegalConnectorArgumentsException | VMStartException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
