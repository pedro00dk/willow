package core;

import com.sun.jdi.event.Event;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class EventProcessor {

    public void trace(Event event) {
        System.out.println(event);
    }
}
