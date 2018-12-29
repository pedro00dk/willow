package core;


import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.StackFrame;
import com.sun.jdi.event.Event;
import core.util.EventUtil;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Inspects the received event, building the stack and heap data and references.
 */
public final class Inspector {

    private Inspector() {
    }

    /**
     * Inspects the program state. Analyses the stack and heap, collecting the objects.
     */
    public static Map<String, Object> inspect(Event event) throws IncompatibleThreadStateException {
        System.out.println(event);
        Map<String, Object> stackInspection = inspectStack(event);
        //noinspection unchecked
        var stackFrames = (List<StackFrame>) stackInspection.get("frames");
        //noinspection unchecked
        var stackLines = (List<Map<String, Object>>) stackInspection.get("lines");

        return Map.ofEntries(Map.entry("stack_lines", stackLines));
    }

    /**
     * Inspects the program stack.
     */
    private static Map<String, Object> inspectStack(Event event) throws IncompatibleThreadStateException {
        var frames = EventUtil.getStackFrames(event);

        var lines = frames.stream()
                .map(StackFrame::location)
                .map(l -> Map.ofEntries(Map.entry("name", l.method().name()), Map.entry("line", l.lineNumber())))
                .collect(Collectors.toList());

        return Map.ofEntries(Map.entry("frames", frames), Map.entry("lines", lines));
    }
}
