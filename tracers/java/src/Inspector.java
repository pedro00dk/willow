import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.sun.jdi.*;
import com.sun.jdi.event.ExceptionEvent;
import com.sun.jdi.event.LocatableEvent;

import java.util.*;
import java.util.stream.Collectors;

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
    JsonObject inspect(LocatableEvent event) throws IncompatibleThreadStateException {
        previousOrderedIds = orderedIds;
        orderedIds = new HashMap<>();

        var snapshot = new JsonObject();
        snapshot.addProperty("info", !(event instanceof ExceptionEvent) ? "ok" : "warn");
        var frames = new ArrayList<>(event.thread().frames());
        Collections.reverse(frames);
        snapshot.add(
                "stack",
                frames.stream()
                        .map(StackFrame::location)
                        .map(l -> {
                            var scope = new JsonObject();
                            scope.addProperty("line", l.lineNumber() - 1);
                            scope.addProperty("name", l.method().name());
                            return scope;
                        })
                        .collect(
                                () -> new JsonArray(frames.size()),
                                JsonArray::add,
                                (scope0, scope1) -> {
                                    throw new RuntimeException("parallel stream not allowed");
                                }
                        )
        );

        snapshot.add("heap", new JsonObject());
        var threadReference = frames.get(0).thread();
        int[] scopeIndex = {0};
        frames.stream()
                .map(f -> {
                    try {
                        return Map.entry(f.visibleVariables(), f.getValues(f.visibleVariables()));
                    } catch (AbsentInformationException e) {
                        throw new RuntimeException(e);
                    }
                })
                // frames get invalid after invoking methods in objects
                // because of this, all variables have to be collected before any evaluation
                .collect(Collectors.toList())
                .forEach(e -> {
                    var localVariables = e.getKey();
                    var values = e.getValue();
                    var scope = snapshot.get("stack").getAsJsonArray().get(scopeIndex[0]++).getAsJsonObject();
                    scope.add(
                            "members",
                            localVariables.stream()
                                    .map(localVariable -> {
                                        var member = new JsonObject();
                                        member.addProperty("key", localVariable.name());
                                        member.add("value", inspectValue(snapshot, values.get(localVariable), threadReference));
                                        return member;
                                    })
                                    .collect(
                                            () -> new JsonArray(localVariables.size()),
                                            JsonArray::add,
                                            (memberA, memberB) -> {
                                                throw new RuntimeException("parallel stream not allowed");
                                            }
                                    )
                    );
                });
        return snapshot;
    }

    /**
     * Recursively inspect values of the heap.
     * Mutates the snapshot if it is an object.
     *
     * @param snapshot        snapshot to be filled with heap information
     * @param jdiValue        value to be processed
     * @param threadReference debugee jvm thread to call functions on it
     * @return the transformed value
     */
    private JsonElement inspectValue(JsonObject snapshot, Value jdiValue, ThreadReference threadReference) {
        JsonElement value;
        return jdiValue == null
                ? new JsonPrimitive("null")
                : (value = inspectPrimitive(jdiValue)) != null
                ? value
                : (value = inspectObject(snapshot, jdiValue, threadReference)) != null
                ? value
                : new JsonPrimitive("unknown");
    }

    private JsonElement inspectPrimitive(Value jdiValue) {
        return jdiValue instanceof PrimitiveValue ?
                jdiValue instanceof BooleanValue
                        ? new JsonPrimitive(Boolean.toString(((BooleanValue) jdiValue).value()))
                        : jdiValue instanceof CharValue
                        ? new JsonPrimitive(Character.toString(((CharValue) jdiValue).value()))
                        : jdiValue instanceof ByteValue
                        ? new JsonPrimitive(((ByteValue) jdiValue).value())
                        : jdiValue instanceof ShortValue
                        ? new JsonPrimitive(((ShortValue) jdiValue).value())
                        : jdiValue instanceof IntegerValue
                        ? new JsonPrimitive(((IntegerValue) jdiValue).value())
                        : jdiValue instanceof FloatValue
                        ? new JsonPrimitive(((FloatValue) jdiValue).value())
                        : jdiValue instanceof DoubleValue
                        ? new JsonPrimitive(((DoubleValue) jdiValue).value())
                        : jdiValue instanceof LongValue
                        ? Math.abs(((LongValue) jdiValue).value()) < Math.pow(2, 53)
                        ? new JsonPrimitive(((LongValue) jdiValue).value())
                        : new JsonPrimitive(Long.toString(((LongValue) jdiValue).value()))
                        : null
                : null;
    }

    private JsonElement inspectObject(JsonObject snapshot, Value jdiValue, ThreadReference threadReference) {
        JsonElement value;
        if (!(jdiValue instanceof ObjectReference)) return null;
        var jdiObjRef = (ObjectReference) jdiValue;
        var stringObj = inspectString(jdiObjRef);
        if (stringObj != null) return stringObj;
        var boxedObj = inspectBoxed(jdiObjRef);
        if (boxedObj != null) return boxedObj;

        var id = jdiObjRef.uniqueID();
        var orderedId = "";
        if (orderedIds.containsKey(id))
            orderedId = orderedIds.get(id);
        else if (previousOrderedIds.containsKey(id)) {
            orderedIds.put(id, previousOrderedIds.get(id));
            orderedId = orderedIds.get(id);
        } else {
            orderedIds.put(id, Long.toString(orderedIdCount++));
            orderedId = orderedIds.get(id);
        }

        if (snapshot.get("heap").getAsJsonObject().has(orderedId)) {
            var idValue = new JsonArray(1);
            idValue.add(id);
            return idValue;
        }

        return (value = inspectArray(snapshot, jdiObjRef, threadReference)) != null
                ? value
                : (value = inspectCollection(snapshot, jdiObjRef, threadReference)) != null
                ? value
                : (value = inspectMap(snapshot, jdiObjRef, threadReference)) != null
                ? value
                : (value = inspectUserObject(snapshot, jdiObjRef, threadReference)) != null
                ? value
                : new JsonPrimitive("class " + jdiObjRef.referenceType().name());
    }

    private JsonElement inspectString(ObjectReference jdiObjRef) {
        return jdiObjRef instanceof StringReference ? new JsonPrimitive(((StringReference) jdiObjRef).value()) : null;
    }

    private JsonElement inspectBoxed(ObjectReference jdiObjRef) {
        try {
            var jdiObjRefClass = Class.forName(jdiObjRef.referenceType().name());
            return Boolean.class.isAssignableFrom(jdiObjRefClass) || Character.class.isAssignableFrom(jdiObjRefClass) ||
                    Byte.class.isAssignableFrom(jdiObjRefClass) || Short.class.isAssignableFrom(jdiObjRefClass) ||
                    Integer.class.isAssignableFrom(jdiObjRefClass) || Long.class.isAssignableFrom(jdiObjRefClass) ||
                    Float.class.isAssignableFrom(jdiObjRefClass) || Double.class.isAssignableFrom(jdiObjRefClass)
                    ? inspectPrimitive(jdiObjRef.getValue(jdiObjRef.referenceType().fieldByName("value")))
                    : null;
        } catch (ClassNotFoundException e) {
            // array types always throw this exception
        }
        return null;
    }

    private JsonElement inspectIterable(JsonObject snapshot, ArrayReference jdiArrRef, String id, String type, String category, ThreadReference threadReference) {
        var obj = new JsonObject();
        // add id to heap graph (it has to be added before other objects inspections)
        snapshot.get("heap").getAsJsonObject().add(id, obj);
        obj.addProperty("type", type);
        obj.addProperty("category", category);
        int[] memberIndex = {0};
        obj.add(
                "members",
                jdiArrRef.getValues().stream()
                        .map(jdiValue -> {
                            var member = new JsonObject();
                            member.addProperty("key", memberIndex[0]++);
                            member.add("value", inspectValue(snapshot, jdiValue, threadReference));
                            return member;
                        })
                        .collect(
                                () -> new JsonArray(jdiArrRef.length()),
                                JsonArray::add,
                                (member0, member1) -> {
                                    throw new RuntimeException("parallel stream not allowed");
                                }
                        )
        );
        var idValue = new JsonArray(1);
        idValue.add(id);
        return idValue;
    }

    private JsonElement inspectArray(JsonObject snapshot, ObjectReference jdiObjRef, ThreadReference threadReference) {
        return jdiObjRef instanceof ArrayReference
                ? inspectIterable(
                snapshot,
                (ArrayReference) jdiObjRef,
                orderedIds.get(jdiObjRef.uniqueID()),
                jdiObjRef.referenceType().name(),
                "list",
                threadReference
        )
                : null;
    }

    private JsonElement inspectCollection(JsonObject snapshot, ObjectReference jdiObjRef, ThreadReference threadReference) {
        try {
            var jdiObjRefClass = Class.forName(jdiObjRef.referenceType().name());
            return Collection.class.isAssignableFrom(jdiObjRefClass)
                    ? inspectIterable(
                    snapshot,
                    (ArrayReference) jdiObjRef.invokeMethod(
                            threadReference,
                            jdiObjRef.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                            List.of(),
                            ObjectReference.INVOKE_SINGLE_THREADED
                    ),
                    orderedIds.get(jdiObjRef.uniqueID()),
                    jdiObjRef.referenceType().name(),
                    List.class.isAssignableFrom(jdiObjRefClass) ? "list" : "set",
                    threadReference
            )
                    : null;
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private JsonElement inspectMap(JsonObject snapshot, ObjectReference jdiObjRef, ThreadReference threadReference) {
        try {
            var jdiObjRefClass = Class.forName(jdiObjRef.referenceType().name());
            if (!Map.class.isAssignableFrom(jdiObjRefClass)) return null;

            var jdiSetRef = (ObjectReference) jdiObjRef.invokeMethod(
                    threadReference,
                    jdiObjRef.referenceType().methodsByName("entrySet").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            var jdiArrRef = (ArrayReference) jdiSetRef.invokeMethod(
                    threadReference,
                    jdiSetRef.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            var id = orderedIds.get(jdiObjRef.uniqueID());
            var obj = new JsonObject();
            // add id to heap graph (it has to be added before other objects inspections)
            snapshot.get("heap").getAsJsonObject().add(id, obj);
            obj.addProperty("type", jdiObjRef.referenceType().name());
            obj.addProperty("category", "map");
            obj.add(
                    "members",
                    jdiArrRef.getValues().stream()
                            .map(jdiValue -> {
                                try {
                                    var jdiValueEntry = (ObjectReference) jdiValue;
                                    var jdiValueEntryKey = jdiValueEntry.invokeMethod(
                                            threadReference,
                                            jdiValueEntry.referenceType().methodsByName("getKey").get(0),
                                            List.of(),
                                            ObjectReference.INVOKE_SINGLE_THREADED
                                    );
                                    var jdiValueEntryValue = jdiValueEntry.invokeMethod(
                                            threadReference,
                                            jdiValueEntry.referenceType().methodsByName("getValue").get(0),
                                            List.of(),
                                            ObjectReference.INVOKE_SINGLE_THREADED
                                    );
                                    var member = new JsonObject();
                                    member.add("key", inspectValue(snapshot, jdiValueEntryKey, threadReference));
                                    member.add("value", inspectValue(snapshot, jdiValueEntryValue, threadReference));
                                    return member;
                                } catch (InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
                                    throw new RuntimeException(e);
                                }
                            })
                            .collect(
                                    () -> new JsonArray(jdiArrRef.length()),
                                    JsonArray::add,
                                    (member0, member1) -> {
                                        throw new RuntimeException("parallel stream not allowed");
                                    }
                            )
            );
            var idValue = new JsonArray(1);
            idValue.add(id);
            return idValue;
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private JsonElement inspectUserObject(JsonObject snapshot, ObjectReference jdiObjRef, ThreadReference threadReference) {
        var jdiObjClassRefData = jdiObjRef.referenceType().toString().split(" ");

        // check if is a class and is defined in the default package (user defined)
        if (!jdiObjClassRefData[0].equals("class") || jdiObjClassRefData[1].contains(".")) return null;

        var orderedFields = jdiObjRef.referenceType().allFields();
        var fieldsValues = jdiObjRef.getValues(orderedFields);
        var id = orderedIds.get(jdiObjRef.uniqueID());
        var obj = new JsonObject();
        // add id to heap graph (it has to be added before other objects inspections)
        snapshot.get("heap").getAsJsonObject().add(id, obj);
        obj.addProperty("type", jdiObjRef.referenceType().name());
        obj.addProperty("category", "map");
        obj.add(
                "members",
                orderedFields.stream()
                        .map(field -> {
                            var member = new JsonObject();
                            member.addProperty("key", field.name());
                            member.add("value", inspectValue(snapshot, fieldsValues.get(field), threadReference));
                            return member;
                        })
                        .collect(
                                () -> new JsonArray(orderedFields.size()),
                                JsonArray::add,
                                (member0, member1) -> {
                                    throw new RuntimeException("parallel stream not allowed");
                                }
                        )
        );
        var idValue = new JsonArray(1);
        idValue.add(id);
        return idValue;
    }
}

