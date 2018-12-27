package core.tracer;

import java.io.IOException;

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
    public void run() throws IOException {
        try {
            project.generate();
            project.compile();

        } catch (Exception e) {
            throw e;
        }
    }
}