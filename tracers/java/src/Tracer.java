import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Traces a java requests.
 */
public class Tracer {
    private String source;
    private String input;
    private int steps;
    private Inspector inspector;
    private JsonObject response;
    private int currentStep;
    private List<String> printCache;

    /**
     * Create the tracer with the request, which contains the program source, input and steps to run.
     *
     * @param request request
     */
    public Tracer(JsonObject request) {
        this.source = request.get("source").getAsString();
        this.input = request.get("input").getAsString();
        this.steps = request.get("steps").getAsInt();
        inspector = new Inspector();
        response = null;
        currentStep = 0;
        printCache = new ArrayList<>();
    }

    /**
     * Run the source and inspect the debugee program state.
     * The debugee program runs in a new JVM.
     * The execution is analysed by the trace(), which is called by the Executor.
     * The trace() may raise TraceStopExceptions or PrintedExceptions to stop the tracing process, the only way to stop
     * the Executor.
     * run(), trace() and the Executor might also raise unexpected exceptions, that will the be captured and returned
     * the same way as exceptions from the debugee program, being easily distinguishable by their tracebacks.
     *
     * @return the tracer response
     */
    JsonObject run() {
        response = new JsonObject();
        response.add("steps", new JsonArray());
        try {
            new Executor().execute(source, this::trace, this::inputHook, this::printHook, this::lockHook);
        } catch (Executor.ApplicationExternalException | TracerStopException e) {
            var threw = new JsonObject();
            threw.addProperty("cause", e.getMessage());
            var step = new JsonObject();
            step.add("threw", threw);
            step.addProperty("prints", String.join("", printCache));
            response.get("steps").getAsJsonArray().add(step);
            return response;
        } catch (PrintedException e) {
            var exception = new JsonObject();
            exception.addProperty("type", e.type);
            exception.addProperty("traceback", e.traceback);
            var error = new JsonObject();
            error.add("exception", exception);
            var step = new JsonObject();
            step.add("error", error);
            step.addProperty("print", String.join("", printCache));
            response.get("steps").getAsJsonArray().add(step);
        } catch (Exception e) {
            var error = new JsonObject();
            var tracebackWriter = new StringWriter();
            e.printStackTrace(new PrintWriter(tracebackWriter, true));
            var traceback = Arrays
                    .stream(tracebackWriter.toString().split("\n"))
                    .map(l -> l + "\n")
                    .collect(Collectors.joining());
            var exception = new JsonObject();
            exception.addProperty("type", e.getClass().getName());
            exception.addProperty("traceback", traceback);
            error.add("exception", exception);
            var step = new JsonObject();
            step.add("error", error);
            step.addProperty("print", String.join("", printCache));
            response.get("steps").getAsJsonArray().add(step);
        }
        return response;
    }

    /**
     * Trace the event.
     * trace() may stop the tracing process if the program reaches the maximum number of steps, it is done by raising a
     * TraceStopException to stop the Executor.
     *
     * @param event event where the stack and heap data will be extracted from.
     * @throws PrintedException
     * @throws TracerStopException
     * @throws IncompatibleThreadStateException
     */
    private void trace(Event event) throws PrintedException, TracerStopException, IncompatibleThreadStateException {
        // check errors print in stdout or stderr in non Locatable frames
        if ((event instanceof VMStartEvent ||
                event instanceof VMDeathEvent ||
                event instanceof VMDisconnectEvent ||
                event instanceof ThreadStartEvent ||
                event instanceof ThreadDeathEvent)
                && !this.printCache.isEmpty()
        ) {
            // exception printed in the error stream is collected to be shown inside a threw object
            var exceptionTraceback = String.join("", this.printCache);
            this.printCache.clear();
            throw new PrintedException(exceptionTraceback);
        }
        if (!(event instanceof LocatableEvent) || !((LocatableEvent) event).thread().name().equals("main")) return;
        if (this.currentStep++ >= this.steps)
            throw new TracerStopException("Program too long, maximum steps allowed: " + this.steps);

        var snapshot = inspector.inspect((LocatableEvent) event);
        var step = new JsonObject();
        step.add("snapshot", snapshot);
        step.addProperty("print", String.join("", printCache));
        response.get("steps").getAsJsonArray().add(step);
        this.printCache.clear();
    }

    /**
     * Return the entire input to be sent to the traced program through standard input.
     *
     * @return the traced program input.
     */
    private String inputHook() {
        return this.input;
    }

    /**
     * Gets the text produced in the standard output and standard error at each step and save it in the print cache.
     *
     * @param text the text collected from the standard output and error streams.
     */
    private void printHook(String text) {
        this.printCache.add(text);
    }

    /**
     * Hook called when very slow operations are made by the traced program and no events are produced within 1 second.
     *
     * @param cause the expected cause, may be null
     * @throws TracerStopException
     */
    private void lockHook(String cause) throws TracerStopException {
        throw new TracerStopException("program requires input or slow function call");
    }

    /**
     * Exception used to stop the Executor.
     */
    static class TracerStopException extends Exception {
        TracerStopException(String message) {
            super(message);
        }
    }

    /**
     * Exception used to indicate that the debugee program printed an exception in the error stream.
     * The exception data is captured by the PrintedException.
     * Always happens when the program finishes throwing an exception.
     */
    static class PrintedException extends Exception {
        String type;
        String traceback;

        PrintedException(String printedException) {
            super();
            var classStartIndex = printedException.indexOf(' ', 20) + 1; // skip "Exception in thread "
            var endClassIndex = printedException.indexOf(' ', classStartIndex);
            type = printedException.substring(classStartIndex, endClassIndex);
            traceback = printedException;
        }
    }


}
