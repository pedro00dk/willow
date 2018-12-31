package core;

import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.Event;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class EventProcessor {

    public void trace(Event event) {
        try {
            System.out.println(Inspector.inspect(event));
        } catch (IncompatibleThreadStateException e) {
            e.printStackTrace();
        }
    }
}
