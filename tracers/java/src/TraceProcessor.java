import com.sun.jdi.event.*;
import protobuf.SnapshotOuterClass;
import protobuf.Tracer;

import java.util.ArrayList;
import java.util.List;

/**
 * Traces java source and analyses its state after each instruction.
 */
public class TraceProcessor {
    private Inspector inspector;
    private Tracer.Result.Builder resultBuilder;
    private Event previousEvent;
    private SnapshotOuterClass.Snapshot previousSnapshot;
    private int maxSteps;
    private int currentStep;
    private String input;
    private List<String> printCache;

    public TraceProcessor(String input, int maxSteps) {
        inspector = new Inspector();
        resultBuilder = Tracer.Result.newBuilder();
        previousEvent = null;
        previousSnapshot = null;
        this.maxSteps = maxSteps;
        currentStep = 0;
        this.input = input;
        printCache = new ArrayList<>();
    }

    public Tracer.Result.Builder getResultBuilder() {
        return resultBuilder;
    }

    public List<String> getPrintCache() {
        return printCache;
    }

    public byte[] getInput() {
        return this.input.getBytes();
    }


    public boolean trace(Event event) throws Exception {
        if (event instanceof VMStartEvent) return true;
        if (event instanceof VMDeathEvent || event instanceof VMDisconnectEvent) return true;
        // uncaught exceptions are followed by a ThreadDeathEvent
        if (event instanceof ThreadStartEvent) return true;
        if (event instanceof ThreadDeathEvent && !(previousEvent instanceof ExceptionEvent)) return true;

        if (this.previousEvent != null) this.previousEvent = event;
        this.currentStep++;
        if (this.currentStep > this.maxSteps) {
            resultBuilder.addStepsBuilder().getThrewBuilder().setCause("maximum steps: " + this.maxSteps);
            return false;
        }

        var snapshotBuilder = inspector.inspect(event, previousSnapshot);
        var stepBuilder = this.resultBuilder.addStepsBuilder();
        stepBuilder.setSnapshot(snapshotBuilder);
        stepBuilder.addAllPrints(this.printCache);
        this.printCache = new ArrayList<>();

        return !snapshotBuilder.getFinish();
    }

    public boolean onLocked(String cause) {
        resultBuilder.addStepsBuilder().getThrewBuilder().setCause(cause);
        return false;
    }

    public void printHook(String text) {
        this.printCache.add(text);
    }
}