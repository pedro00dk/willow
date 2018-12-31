package core;

import core.util.ExceptionUtil;
import message.ActionMessage;
import message.ResultMessage;

import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.SynchronousQueue;

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

        actionQueue = new SynchronousQueue<>();
        resultQueue = new SynchronousQueue<>();
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
            actionQueue.put(new ActionMessage(ActionMessage.Action.STOP, null));
            tracerThread.join();
        } catch (InterruptedException e) {
            // ignore interruptions
        }
        tracerThread = null;
        actionQueue = null;
        resultQueue = null;
    }
}
