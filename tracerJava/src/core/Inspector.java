package core;


import com.sun.jdi.AbsentInformationException;
import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.StackFrame;
import com.sun.jdi.event.Event;
import core.util.EventUtil;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
        var stackInspection = inspectStack(event);
        //noinspection unchecked
        var stackFrames = (List<StackFrame>) stackInspection.get("frames");
        //noinspection unchecked
        var stackLines = (List<Map<String, Object>>) stackInspection.get("lines");

        var heapInspection = inspectHeap(event, stackFrames);
        //noinspection unchecked
        var stackReferences = (List<List<List<Object>>>) heapInspection.get("stack_references");


        return Map.ofEntries(
                Map.entry("stack_lines", stackLines),
                Map.entry("stack_references", stackReferences)
        );
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

    /**
     * Inspects the program heap by looking every object recursively found from the stack frames.
     */
    private static Map<String, Object> inspectHeap(Event event, List<StackFrame> stackFrames) {
        // stack refs
        var heapGraph = new HashMap<Integer, Map<String, Object>>();
        var userClasses = new HashSet<String>();

        var stackReferences = IntStream.range(0, stackFrames.size())
                .mapToObj(i -> stackFrames.get(stackFrames.size() - 1 - i))
                .map(f -> {
                    try {
                        var localVariablesDeclarationOrdered = f.visibleVariables();
                        var localVariables = f.getValues(localVariablesDeclarationOrdered);
                        return localVariablesDeclarationOrdered.stream()
                                .map(l -> Map.entry(l, localVariables.get(l)))
                                .map(e -> List.of(e.getKey().name(), new Object()))
                                .collect(Collectors.toList());
                    } catch (AbsentInformationException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        return Map.ofEntries(Map.entry("stack_references", stackReferences));
    }

    /**
     * Inspects the received object.
     * If the object is a const (bool, int, float, None, complex, str), returns its value.
     * If the object is a type (type), returns its type name.
     * Otherwise, returns the object reference (list with a single number inside) recursively, inspecting object
     * members and filling the heap_graph and user_classes
     */
    private static Object inspectObject(Object obj, Map<Integer, Map<String, Object>> heapGraph, Set<String> userClasses) {
        if (obj == null || obj instanceof Boolean || obj instanceof Byte || obj instanceof Short ||
                obj instanceof Integer || obj instanceof Float || obj instanceof Double || obj instanceof Long ||
                obj instanceof Character) {
            return obj;
        }
        if (obj instanceof String) {
            return "\"" + obj.toString() + "\"";
        }
        if (obj instanceof Class) {
            return ((Class) obj).getName();
        }

        return null;
    }
}
