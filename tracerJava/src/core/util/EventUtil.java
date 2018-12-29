package core.util;

import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.StackFrame;
import com.sun.jdi.ThreadReference;
import com.sun.jdi.event.Event;
import com.sun.jdi.event.LocatableEvent;

import java.util.List;

/**
 * Utility functions for processing events.
 */
public final class EventUtil {

    private EventUtil() {
    }

    /**
     * Returns the thread reference of an event, if the event is not locatable, throws an exception.
     */
    public static ThreadReference getThreadReference(Event event) {
        if (!(event instanceof LocatableEvent)) {
            throw new IllegalArgumentException("received event is not locatable");
        }
        return ((LocatableEvent) event).thread();

    }

    /**
     * Returns the stack frames of the received event.
     */
    public static List<StackFrame> getStackFrames(Event event) throws IncompatibleThreadStateException {
        var threadReference = getThreadReference(event);
        return threadReference.frames();
    }
}
