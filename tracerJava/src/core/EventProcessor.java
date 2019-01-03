package core;

import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.Event;
import core.util.ExceptionUtil;
import message.ActionMessage;
import message.ResultMessage;

import java.util.concurrent.BlockingQueue;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class EventProcessor {
    private BlockingQueue<ActionMessage> actionQueue;
    private BlockingQueue<ResultMessage> resultQueue;
    private int inspectedEventCount;

    /**
     * Initializes the event processor with the communication queues.
     */
    public EventProcessor(BlockingQueue<ActionMessage> actionQueue, BlockingQueue<ResultMessage> resultQueue) {
        this.actionQueue = actionQueue;
        this.resultQueue = resultQueue;
        inspectedEventCount = 0;
    }

    /**
     * The code trace function. Returns if should continue tracing.
     */
    public boolean trace(Event event) {
        inspectedEventCount++;

        try {
            var action = actionQueue.take();
            if (action.getAction() == ActionMessage.Action.STEP) {
                var data = Inspector.inspect(event);
                resultQueue.put(new ResultMessage(ResultMessage.Result.DATA, data));
            } else if (action.getAction() == ActionMessage.Action.STOP) {
                resultQueue.put(new ResultMessage(ResultMessage.Result.DATA, null));
                return false;
            }
        } catch (InterruptedException | IncompatibleThreadStateException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.ERROR, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
            return false;
        }
        return true;
    }

    /**
     * Hook for print or error calls.
     */
    public void printHook(String text) {
        try {
            resultQueue.put(new ResultMessage(ResultMessage.Result.PRINT, text));
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.ERROR, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
        }
    }
}