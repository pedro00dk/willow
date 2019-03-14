package core;

import com.sun.jdi.event.*;
import protobuf.EventOuterClass;
import protobuf.Tracer;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.BlockingQueue;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class FrameProcessor {
    private BlockingQueue<Tracer.Action> actionQueue;
    private BlockingQueue<EventOuterClass.Event> eventQueue;
    private Event jdiPreviousEvent;
    private EventOuterClass.Frame previousFrame;
    private int inspectedEventCount;
    private Queue<String> inputCache;

    public FrameProcessor(BlockingQueue<Tracer.Action> actionQueue, BlockingQueue<EventOuterClass.Event> eventQueue) {
        this.actionQueue = actionQueue;
        this.eventQueue = eventQueue;

        // frame common info
        jdiPreviousEvent = null;
        previousFrame = null;

        // hooks attributes
        inputCache = new LinkedList<>();
    }

    public boolean trace(Event jdiEvent) throws Exception {
        if (jdiEvent instanceof VMStartEvent || jdiEvent instanceof VMDeathEvent ||
                jdiEvent instanceof VMDisconnectEvent || jdiEvent instanceof ThreadStartEvent
                // uncatch exceptions are followed by a ThreadDeathEvent
                || (jdiEvent instanceof ThreadDeathEvent && !(jdiPreviousEvent instanceof ExceptionEvent)))
            return true;

        while (true) {
            var action = actionQueue.take();

            if (action.hasStop()) return false;
            else if (action.hasStep()) {
                var frame = Inspector.inspect(jdiEvent, previousFrame);
                jdiPreviousEvent = jdiEvent;
                previousFrame = frame;
                var eventBuilder = EventOuterClass.Event.newBuilder();
                eventBuilder.getInspectedBuilder().setFrame(frame);
                eventQueue.put(eventBuilder.build());
                break;
            } else if (action.hasInput())
                action.getInput().getLinesList().forEach(l -> inputCache.offer(l));
            else throw new Exception("unexpected action");
        }
        return true;
    }

    public String inputHook() throws Exception {
        while (true) {
            if (!inputCache.isEmpty()) return inputCache.poll();
            var action = actionQueue.take();
            if (action.hasStop()) {
                actionQueue.put(action);
                inputCache.offer(" ".repeat(100));
            } else if (action.hasInput()) {
                action.getInput().getLinesList().forEach(l -> inputCache.offer(l));
            } else if (action.hasStep()) {
                // do not throw exception (will send LOCKED event)
            } else throw new Exception("unexpected action");

            if (inputCache.size() == 0) {
                var lockedEventBuilder = EventOuterClass.Event.newBuilder();
                lockedEventBuilder.getLockedBuilder().setCause("input");
                eventQueue.put(lockedEventBuilder.build());
            }
        }
    }

    public void printHook(String text) throws Exception {
        var eventBuilder = EventOuterClass.Event.newBuilder();
        eventBuilder.getPrintedBuilder().setValue(text);
        eventQueue.put(eventBuilder.build());
    }
}