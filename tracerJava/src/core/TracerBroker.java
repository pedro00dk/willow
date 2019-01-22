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
            actionQueue.put(new ActionMessage(ActionMessage.Action.start, null));
            result = resultQueue.take();
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            result = new ResultMessage(ResultMessage.Result.error, exceptionDump);
        }

        if (result.getResult() == ResultMessage.Result.error) {
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
            actionQueue.offer(new ActionMessage(ActionMessage.Action.stop, null));
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
    public List<ResultMessage> step() {
        if (!isTracerRunning()) throw new IllegalStateException("tracer not running");

        List<ResultMessage> results = new ArrayList<>();
        ResultMessage result = null;
        try {
            actionQueue.put(new ActionMessage(ActionMessage.Action.step, null));
            while (true) {
                result = resultQueue.take();
                results.add(result);
                if (result.getResult().equals(ResultMessage.Result.data) ||
                        result.getResult().equals(ResultMessage.Result.error) ||
                        result.getResult().equals(ResultMessage.Result.locked))
                    break;
            }
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            result = new ResultMessage(ResultMessage.Result.error, exceptionDump);
            results.add(result);
        }

        //noinspection unchecked
        if (result.getResult() == ResultMessage.Result.data &&
                (boolean) ((Map<String, Object>) result.getValue()).get("finish") ||
                result.getResult() == ResultMessage.Result.error)
            stop();

        return results;
    }

    /**
     * Sends a input string to program. Inputs have no response.
     */
    public void input(String data) throws InterruptedException {
        if (!isTracerRunning()) throw new IllegalStateException("tracer not running");
        if (data == null) throw new NullPointerException("data cannot be null");

        actionQueue.put(new ActionMessage(ActionMessage.Action.input, data));
    }
}
