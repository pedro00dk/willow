package core;

import core.util.ExceptionUtil;
import message.ActionMessage;
import message.ResultMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;

/**
 * Provides an easy interface for communication with the Tracer as it has to run in another process.
 */
public class TracerBroker {
    private String filename;
    private String code;
    private BlockingQueue<ActionMessage> actionQueue;
    private BlockingQueue<ResultMessage> resultQueue;
    private Thread tracerThread;

    /**
     * Stores the Tracer parameters for posterior usage when starting the Tracer.
     */
    public TracerBroker(String filename, String code) {
        this.filename = filename;
        this.code = code;
    }

    public boolean isTracerRunning() {
        return tracerThread != null;
    }

    /**
     * Starts the tracer in a new thread.
     */
    public List<ResultMessage> start() {
        if (isTracerRunning()) throw new IllegalStateException("tracer already running");

        actionQueue = new LinkedBlockingDeque<>();
        resultQueue = new LinkedBlockingDeque<>();
        tracerThread = new Thread(() -> new Tracer(filename, code, actionQueue, resultQueue).run());
        tracerThread.start();

        ResultMessage result;
        try {
            actionQueue.put(new ActionMessage(ActionMessage.Action.START, null));
            result = resultQueue.take();
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            result = new ResultMessage(ResultMessage.Result.ERROR, exceptionDump);
        }

        if (result.getResult() == ResultMessage.Result.ERROR) {
            stop();
        }

        return List.of(result);
    }

    /**
     * Stops the tracer thread.
     */
    public void stop() {
        if (!isTracerRunning()) throw new IllegalStateException("tracer already stopped");

        try {
            actionQueue.offer(new ActionMessage(ActionMessage.Action.STOP, null));
            tracerThread.join();
        } catch (InterruptedException e) {
            // ignore interruptions
        }
        tracerThread = null;
        actionQueue = null;
        resultQueue = null;
    }

    /**
     * Steps into the script.
     */
    public List<ResultMessage> step(int count) {
        if (!isTracerRunning()) throw new IllegalStateException("tracer not running");
        if (count < 1) throw new IllegalArgumentException("count smaller than 1");

        List<ResultMessage> results = new ArrayList<>();
        ResultMessage result = null;
        try {
            actionQueue.put(new ActionMessage(ActionMessage.Action.STEP, Map.ofEntries(Map.entry("count", 1))));
            while (true) {
                result = resultQueue.take();
                results.add(result);
                if (result.getResult().equals(ResultMessage.Result.DATA) ||
                        result.getResult().equals(ResultMessage.Result.ERROR) ||
                        result.getResult().equals(ResultMessage.Result.LOCKED))
                    break;
            }
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            result = new ResultMessage(ResultMessage.Result.ERROR, exceptionDump);
            results.add(result);
        }

        //noinspection unchecked
        if (result.getResult() == ResultMessage.Result.DATA &&
                (boolean) ((Map<String, Object>) result.getValue()).get("finish") ||
                result.getResult() == ResultMessage.Result.ERROR)
            stop();

        return results;
    }

}
