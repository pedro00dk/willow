package tracer;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.sun.jdi.*;
import com.sun.jdi.event.*;

import java.util.*;


/**
 * Inspect events and produces maps with their state data.
 */
class Inspector {
    private long orderedIdCount;
    private Map<Long, String> orderedIds;
    private Map<Long, String> previousOrderedIds;

    /**
     * Initialize the inspector and ordered id generators.
     */
    public Inspector() {
        orderedIdCount = 0;
        orderedIds = new HashMap<>();
        previousOrderedIds = new HashMap<>();
    }

    /**
     * Inspect the event to build a map with state data.
     *
     * @param event event where the state data will be extracted from
     * @return the processed event data
     * @throws IncompatibleThreadStateException
     */
    JsonObject inspect(LocatableEvent event) throws IncompatibleThreadStateException, AbsentInformationException {
        previousOrderedIds = orderedIds;
        orderedIds = new HashMap<>();

        var eventString = event instanceof StepEvent ? "line"
                : event instanceof MethodEntryEvent ? "call"
                : event instanceof MethodExitEvent ? "return"
                : event instanceof ExceptionEvent ? "exception"
                : "line";
        var frames = collectFrames(event);
        var stack = createStack(frames);
        var heap = createHeap(stack, frames);
        var snapshot = new JsonObject();
        snapshot.addProperty("event", eventString);
        snapshot.add("stack", stack);
        snapshot.add("heap", heap);
        return snapshot;
    }

    /**
     * Collect all frames of the event.
     *
     * @param event a locatable event
     * @return collected frames
     * @throws IncompatibleThreadStateException
     */
    private ArrayList<StackFrame> collectFrames(LocatableEvent event) throws IncompatibleThreadStateException {
        var frames = new ArrayList<>(event.thread().frames());
        Collections.reverse(frames);
        return frames;
    }

    /**
     * Creates a json array of json objects with the names and first lines of the the received frames.
     *
     * @param frames frames to process
     * @return collected stack data
     */
    private JsonArray createStack(List<StackFrame> frames) {
        var stack = new JsonArray(frames.size());
        for (var frame : frames) {
            var location = frame.location();
            var scope = new JsonObject();
            scope.addProperty("line", location.lineNumber() - 1);
            scope.addProperty("name", location.method().name());
            stack.add(scope);
        }
        return stack;
    }

    private JsonObject createHeap(JsonArray stack, List<StackFrame> frames) throws AbsentInformationException {
        var heap = new JsonObject();
        var threadReference = frames.get(0).thread();
        var variables = new ArrayList<List<LocalVariable>>(frames.size());
        var values = new ArrayList<Map<LocalVariable, Value>>(frames.size());
        for (var frame : frames) {
            var frameVariables = frame.visibleVariables();
            var frameValues = frame.getValues(frameVariables);
            variables.add(frameVariables);
            values.add(frameValues);
        }
        // collect all values before any evaluation
        // frames get invalid after invoking methods in objects
        for (int i = 0; i < frames.size(); i++) {
            var frameVariables = variables.get(i);
            var frameValues = values.get(i);
            var members = new JsonArray(frameVariables.size());
            for (var frameVariable : frameVariables) {
                var name = frameVariable.name();
                if (name.equals("args")) continue;
                var member = new JsonObject();
                member.addProperty("key", name);
                member.add("value", inspectValue(heap, frameValues.get(frameVariable), threadReference));
                members.add(member);
            }
            var scope = stack.get(i).getAsJsonObject();
            scope.add("members", members);
        }
        return heap;
    }

    /**
     * Recursively inspect values of the heap.
     * Mutates the snapshot if it is an object.
     *
     * @param heap            heap to be filled with value information
     * @param value           value to be processed
     * @param threadReference debugee jvm thread to call functions on it
     * @return the transformed value
     */
    private JsonElement inspectValue(JsonObject heap, Value value, ThreadReference threadReference) {
        if (value == null) new JsonPrimitive("null");
        if (value instanceof PrimitiveValue) return inspectPrimitive((PrimitiveValue) value);
        if (value instanceof ObjectReference) return inspectObject(heap, (ObjectReference) value, threadReference);
        return new JsonPrimitive("void");
    }

    private JsonElement inspectPrimitive(PrimitiveValue value) {
        return value instanceof IntegerValue
                ? new JsonPrimitive(((IntegerValue) value).value())
                : value instanceof BooleanValue
                ? new JsonPrimitive(Boolean.toString(((BooleanValue) value).value()))
                : value instanceof DoubleValue
                ? new JsonPrimitive(((DoubleValue) value).value())
                : value instanceof CharValue
                ? new JsonPrimitive(Character.toString(((CharValue) value).value()))
                : value instanceof FloatValue
                ? new JsonPrimitive(((FloatValue) value).value())
                : value instanceof LongValue
                ? Math.abs(((LongValue) value).value()) < Math.pow(2, 53)
                ? new JsonPrimitive(((LongValue) value).value())
                : new JsonPrimitive(Long.toString(((LongValue) value).value()))
                : value instanceof ByteValue
                ? new JsonPrimitive(((ByteValue) value).value())
                : new JsonPrimitive(((ShortValue) value).value());

    }

    private JsonElement inspectObject(JsonObject heap, ObjectReference value, ThreadReference threadReference) {
        if (value instanceof StringReference) return new JsonPrimitive(((StringReference) value).value());
        Class<?> valueClass = null;
        try {
            valueClass = Class.forName(value.referenceType().name());
            if (Integer.class.isAssignableFrom(valueClass) || Boolean.class.isAssignableFrom(valueClass) ||
                    Double.class.isAssignableFrom(valueClass) || Character.class.isAssignableFrom(valueClass) ||
                    Float.class.isAssignableFrom(valueClass) || Long.class.isAssignableFrom(valueClass) ||
                    Byte.class.isAssignableFrom(valueClass) || Short.class.isAssignableFrom(valueClass)
            ) return inspectPrimitive((PrimitiveValue) value.getValue(value.referenceType().fieldByName("value")));
        } catch (ClassNotFoundException e) {
            // array types always throw class not found
        }
        var id = value.uniqueID();
        String orderedId;
        if (orderedIds.containsKey(id))
            orderedId = orderedIds.get(id);
        else if (previousOrderedIds.containsKey(id)) {
            orderedIds.put(id, previousOrderedIds.get(id));
            orderedId = orderedIds.get(id);
        } else {
            orderedIds.put(id, Long.toString(orderedIdCount++));
            orderedId = orderedIds.get(id);
        }
        if (heap.has(orderedId)) {
            var idValue = new JsonArray(1);
            idValue.add(id);
            return idValue;
        }
        var className = value.referenceType().name();
        if (value instanceof ArrayReference)
            return inspectArray(heap, (ArrayReference) value, orderedId, className, "list", threadReference);
        if (valueClass != null && Collection.class.isAssignableFrom(valueClass)) {
            try {
                var collectionArrayValue = value.invokeMethod(
                        threadReference,
                        value.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                        List.of(),
                        ObjectReference.INVOKE_SINGLE_THREADED
                );
                return inspectArray(heap, (ArrayReference) collectionArrayValue, orderedId, className, List.class.isAssignableFrom(valueClass) ? "list" : "set", threadReference);
            } catch (InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
                return new JsonPrimitive("unknown");
            }
        }
        if (valueClass != null && Map.class.isAssignableFrom(valueClass))
            return inspectMap(heap, value, orderedId, className, "map", threadReference);
        var referenceData = value.referenceType().toString().split(" ");
        if (referenceData[0].equals("class") && !referenceData[1].contains("."))
            return inspectUserObject(heap, value, orderedId, className, "map", threadReference);
        return new JsonPrimitive("class " + className);
    }

    private JsonElement inspectArray(JsonObject heap, ArrayReference value, String id, String type, String category, ThreadReference threadReference) {
        var obj = new JsonObject();
        heap.add(id, obj);
        obj.addProperty("id", id);
        obj.addProperty("type", type);
        obj.addProperty("category", category);
        var members = new JsonArray(value.length());
        var values = value.getValues();
        for (var i = 0; i < values.size(); i++) {
            var member = new JsonObject();
            member.addProperty("key", i);
            member.add("value", inspectValue(heap, values.get(i), threadReference));
            members.add(member);
        }
        obj.add("members", members);
        var idValue = new JsonArray(1);
        idValue.add(id);
        return idValue;
    }

    private JsonElement inspectMap(JsonObject heap, ObjectReference value, String id, String type, String category, ThreadReference threadReference) {
        ArrayReference entryArrayValue = null;
        try {
            var entrySetValue = (ObjectReference) value.invokeMethod(
                    threadReference,
                    value.referenceType().methodsByName("entrySet").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            entryArrayValue = (ArrayReference) entrySetValue.invokeMethod(
                    threadReference,
                    entrySetValue.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
        } catch (InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            return new JsonPrimitive("unknown");
        }
        var obj = new JsonObject();
        heap.add(id, obj);
        obj.addProperty("id", id);
        obj.addProperty("type", type);
        obj.addProperty("category", category);
        var members = new JsonArray(entryArrayValue.length());
        for (var entryValue : entryArrayValue.getValues()) {
            var objEntryValue = (ObjectReference) entryValue;
            Value entryKeyValue = null;
            Value entryValueValue = null;
            try {
                entryKeyValue = objEntryValue.invokeMethod(
                        threadReference,
                        objEntryValue.referenceType().methodsByName("getKey").get(0),
                        List.of(),
                        ObjectReference.INVOKE_SINGLE_THREADED
                );
                entryValueValue = objEntryValue.invokeMethod(
                        threadReference,
                        objEntryValue.referenceType().methodsByName("getValue").get(0),
                        List.of(),
                        ObjectReference.INVOKE_SINGLE_THREADED
                );
            } catch (InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
                return new JsonPrimitive("unknown");
            }
            var member = new JsonObject();
            member.add("key", inspectValue(heap, entryKeyValue, threadReference));
            member.add("value", inspectValue(heap, entryValueValue, threadReference));
            members.add(member);
        }
        obj.add("members", members);
        var idValue = new JsonArray(1);
        idValue.add(id);
        return idValue;
    }

    private JsonElement inspectUserObject(JsonObject heap, ObjectReference value, String id, String type, String category, ThreadReference threadReference) {
        var obj = new JsonObject();
        heap.add(id, obj);
        obj.addProperty("id", id);
        obj.addProperty("type", type);
        obj.addProperty("category", category);
        var fields = value.referenceType().allFields();
        var fieldsValues = value.getValues(fields);
        var members = new JsonArray(fields.size());
        for (var field : fields) {
            var member = new JsonObject();
            member.addProperty("key", field.name());
            member.add("value", inspectValue(heap, fieldsValues.get(field), threadReference));
            members.add(member);
        }
        obj.add("members", members);
        var idValue = new JsonArray(1);
        idValue.add(id);
        return idValue;
    }
}

