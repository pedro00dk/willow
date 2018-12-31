package core;

import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.Event;

/**
 * Read events queue waiting for actions, process the frames and write the results in the queue.
 */
public class EventProcessor {

    /**
     * The code trace function, returns if should continue tracing.
     */
    public boolean trace(Event event) {
        try {
            System.out.println(Inspector.inspect(event));
            return true;
        } catch (IncompatibleThreadStateException e) {
            e.printStackTrace();
            return false;
        }
    }
}
