package core;

import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.*;
import core.util.ExceptionUtil;
import message.ActionMessage;
import message.ResultMessage;

import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.BlockingQueue;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class EventProcessor {
    private BlockingQueue<ActionMessage> actionQueue;
    private BlockingQueue<ResultMessage> resultQueue;
    private Event previousEvent;
    private Map<String, Object> previousEventData;
    private int inspectedEventCount;
    private Queue<String> inputCache;

    /**
     * Initializes the event processor with the communication queues.
     */
    public EventProcessor(BlockingQueue<ActionMessage> actionQueue, BlockingQueue<ResultMessage> resultQueue) {
        this.actionQueue = actionQueue;
        this.resultQueue = resultQueue;

        // frame common info
        previousEvent = null;
        previousEventData = null;
        inspectedEventCount = 0;

        // hooks attributes
        inputCache = new LinkedList<>();
    }

    /**
     * The code trace function. Returns if should continue tracing.
     */
    public boolean trace(Event event) {
        if (event instanceof VMStartEvent || event instanceof VMDeathEvent || event instanceof VMDisconnectEvent ||
                event instanceof ThreadStartEvent
                // uncatch exceptions are followed by a ThreadDeathEvent
                || (event instanceof ThreadDeathEvent && !(previousEvent instanceof ExceptionEvent)))
            return true;

        inspectedEventCount++;

        try {
            while (true) {
                var action = actionQueue.take();

                // hold action (does not consume the frame)
                if (action.getName() == ActionMessage.Action.input) {
                    inputCache.offer((String) action.getValue());
                    continue;
                }

                // progressive actions
                if (action.getName() == ActionMessage.Action.step) {
                    var data = Inspector.inspect(event, previousEventData);
                    previousEvent = event;
                    previousEventData = data;
                    resultQueue.put(new ResultMessage(ResultMessage.Result.data, data));
                } else if (action.getName() == ActionMessage.Action.stop) {
                    resultQueue.put(new ResultMessage(ResultMessage.Result.data, null));
                    return false;
                }
                break;
            }
        } catch (InterruptedException | IncompatibleThreadStateException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.error, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
            return false;
        }


        return true;
    }

    /**
     * Hook for input calls.
     */
    public String inputHook() {

        // cached input
        if (!inputCache.isEmpty()) return inputCache.poll();

        // missing input
        try {
            while (true) {
                var action = actionQueue.take();
                if (action.getName() == ActionMessage.Action.input)
                    return (String) action.getValue();
                if (action.getName() == ActionMessage.Action.stop) {
                    actionQueue.put(action);
                    return "";
                }
                resultQueue.put(new ResultMessage(ResultMessage.Result.locked, "input locked, skipping action"));
            }
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.error, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
        }
        return "";
    }

    /**
     * Hook for print or error calls.
     */
    public void printHook(String text) {
        try {
            resultQueue.put(new ResultMessage(ResultMessage.Result.print, text));
        } catch (InterruptedException e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.error, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
        }
    }
}