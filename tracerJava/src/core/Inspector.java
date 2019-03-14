package core;

import com.sun.jdi.*;
import com.sun.jdi.event.*;
import core.util.EventUtil;
import core.util.ExceptionUtil;
import protobuf.EventOuterClass;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Inspects the received event, building the stack and heap data and references.
 */
public final class Inspector {

    private Inspector() {
    }

    public static EventOuterClass.Frame inspect(Event event, EventOuterClass.Frame previousFrame) throws IncompatibleThreadStateException {
        EventOuterClass.Frame.Type type = null;
        if (event instanceof MethodEntryEvent)
            type = EventOuterClass.Frame.Type.CALL;
        else if (event instanceof MethodExitEvent || event instanceof ThreadDeathEvent)
            type = EventOuterClass.Frame.Type.RETURN;
        else if (event instanceof ExceptionEvent)
            type = EventOuterClass.Frame.Type.EXCEPTION;
        else
            type = EventOuterClass.Frame.Type.LINE;

        if (event instanceof ThreadDeathEvent)
            return previousFrame.toBuilder()
                    .setType(type)
                    .setFinish(true)
                    .clearException()
                    .build();

        var heapInspection = inspectHeap(event, inspectStack(event));
        var stackBuilder = (EventOuterClass.Frame.Stack.Builder) heapInspection.get("stack");
        var heapBuilder = (EventOuterClass.Frame.Heap.Builder) heapInspection.get("heap");
        EventOuterClass.Exception.Builder exception = null;
        if (event instanceof ExceptionEvent) {
            var exceptionEvent = (ExceptionEvent) event;
            var exceptionMessage = ((StringReference) exceptionEvent.exception().getValue(
                    exceptionEvent.exception().referenceType().fieldByName("detailMessage")
            )).value();
            exception = ExceptionUtil.dump(
                    exceptionEvent.exception().referenceType().name(),
                    List.of(exceptionMessage),
                    exceptionMessage
            );
        }
        var frameBuilder = EventOuterClass.Frame.newBuilder()
                .setType(type)
                .setFinish(type == EventOuterClass.Frame.Type.RETURN && stackBuilder.getScopesCount() == 1)
                .setStack(stackBuilder)
                .setHeap(heapBuilder);
        if (exception != null) frameBuilder.setException(exception);
        return frameBuilder.build();
    }

    private static EventOuterClass.Frame.Stack.Builder inspectStack(Event event) throws IncompatibleThreadStateException {
        var frames = EventUtil.getStackFrames(event);
        return EventOuterClass.Frame.Stack.newBuilder()
                .addAllScopes(
                        frames.stream()
                                .map(StackFrame::location)
                                .map(l -> EventOuterClass.Frame.Stack.Scope.newBuilder()
                                        .setLine(l.lineNumber())
                                        .setName(l.method().name())
                                        .build()
                                )
                                .collect(Collectors.toList())
                );
    }

    private static Map<String, Object> inspectHeap(Event event, EventOuterClass.Frame.Stack.Builder stackBuilder) throws IncompatibleThreadStateException {
        var heapBuilder = EventOuterClass.Frame.Heap.newBuilder();
        var frames = EventUtil.getStackFrames(event);
        var threadReference = frames.get(0).thread();
        var index = new AtomicInteger();
        var scopes = frames.stream()
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
                .stream()
                .map(e -> {
                    var visibleVariables = e.getKey();
                    var variablesValues = e.getValue();
                    var variables = visibleVariables.stream()
                            .map(var -> EventOuterClass.Frame.Stack.Scope.Variable.newBuilder()
                                    .setName(var.name())
                                    .setValue(inspectObject(variablesValues.get(var), threadReference, heapBuilder))
                                    .build()
                            )
                            .collect(Collectors.toList());
                    var scopeIndex = index.getAndIncrement();
                    return EventOuterClass.Frame.Stack.Scope.newBuilder()
                            .addAllVariables(variables)
                            .setLine(stackBuilder.getScopes(scopeIndex).getLine())
                            .setName(stackBuilder.getScopes(scopeIndex).getName())
                            .build();

                })
                .collect(Collectors.toList());
        return Map.ofEntries(
                Map.entry("stack", stackBuilder.addAllScopes(scopes)),
                Map.entry("heap", heapBuilder)
        );
    }

    private static EventOuterClass.Frame.Value.Builder inspectObject(Value jdiValue, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        if (jdiValue == null) EventOuterClass.Frame.Value.newBuilder().setStringValue("null");
        var value = inspectPrimitive(jdiValue);
        if (value != null) return value;
        value = inspectString(jdiValue);
        if (value != null) return value;
        if (!(jdiValue instanceof ObjectReference)) return null;
        var jdiObjRef = (ObjectReference) jdiValue;
        value = inspectBoxed(jdiObjRef);
        if (value != null) return value;
        value = inspectArray(jdiObjRef, threadReference, heapBuilder);
        if (value != null) return value;
        value = inspectListOrSet(jdiObjRef, threadReference, heapBuilder);
        if (value != null) return value;
        value = inspectMap(jdiObjRef, threadReference, heapBuilder);
        if (value != null) return value;
        value = inspectUuserObject(jdiObjRef, threadReference, heapBuilder);
        if (value != null) return value;
        return EventOuterClass.Frame.Value.newBuilder()
                .setStringValue(jdiObjRef.referenceType().name());
    }

    private static EventOuterClass.Frame.Value.Builder inspectPrimitive(Value jdiValue) {
        if (jdiValue instanceof PrimitiveValue) {
            var valueBuilder = EventOuterClass.Frame.Value.newBuilder();
            if (jdiValue instanceof BooleanValue) valueBuilder.setBooleanValue(((BooleanValue) jdiValue).value());
            if (jdiValue instanceof CharValue)
                valueBuilder.setStringValue(String.valueOf(((CharValue) jdiValue).value()));
            if (jdiValue instanceof ByteValue) valueBuilder.setIntegerValue(((ByteValue) jdiValue).value());
            if (jdiValue instanceof ShortValue) valueBuilder.setIntegerValue(((ShortValue) jdiValue).value());
            if (jdiValue instanceof IntegerValue) valueBuilder.setIntegerValue(((IntegerValue) jdiValue).value());
            if (jdiValue instanceof LongValue) valueBuilder.setIntegerValue(((LongValue) jdiValue).value());
            if (jdiValue instanceof FloatValue) valueBuilder.setFloatValue(((FloatValue) jdiValue).value());
            if (jdiValue instanceof DoubleValue) valueBuilder.setFloatValue(((DoubleValue) jdiValue).value());
            return valueBuilder;
        }
        return null;
    }

    private static EventOuterClass.Frame.Value.Builder inspectString(Value jdiValue) {
        if (!(jdiValue instanceof StringReference)) return null;
        return EventOuterClass.Frame.Value.newBuilder()
                .setStringValue("\"" + ((StringReference) jdiValue).value() + "\"");
    }

    private static EventOuterClass.Frame.Value.Builder inspectBoxed(ObjectReference jdiObjRef) {
        try {
            var objClass = Class.forName(jdiObjRef.referenceType().name());
            if (Boolean.class.isAssignableFrom(objClass) || Character.class.isAssignableFrom(objClass) ||
                    Byte.class.isAssignableFrom(objClass) || Short.class.isAssignableFrom(objClass) ||
                    Integer.class.isAssignableFrom(objClass) || Long.class.isAssignableFrom(objClass) ||
                    Float.class.isAssignableFrom(objClass) || Double.class.isAssignableFrom(objClass)) {
                var primitiveValue = jdiObjRef.getValue(jdiObjRef.referenceType().fieldByName("value"));
                return inspectPrimitive(primitiveValue);
            }
        } catch (ClassNotFoundException e) {
            // array types always throw this exception
        }
        return null;
    }

    private static EventOuterClass.Frame.Value.Builder inspectIterable(ArrayReference arrayRef, long objId, EventOuterClass.Frame.Heap.Obj.Type type, String lType, boolean userDefined, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        var memberIndex = new AtomicInteger();
        heapBuilder.putReferences(objId, EventOuterClass.Frame.Heap.Obj.getDefaultInstance());
        var members = arrayRef.getValues().stream()
                .map(v -> EventOuterClass.Frame.Heap.Obj.Member.newBuilder()
                        .setKey(EventOuterClass.Frame.Value.newBuilder()
                                .setIntegerValue(memberIndex.getAndIncrement())
                                .build()
                        )
                        .setValue(inspectObject(v, threadReference, heapBuilder))
                        .build()
                )
                .collect(Collectors.toList());
        heapBuilder.putReferences(
                objId,
                EventOuterClass.Frame.Heap.Obj.newBuilder()
                        .setType(type)
                        .setLType(lType)
                        .setUserDefined(userDefined)
                        .addAllMembers(members)
                        .build()
        );
        return EventOuterClass.Frame.Value.newBuilder()
                .setReference(objId);
    }

    private static EventOuterClass.Frame.Value.Builder inspectArray(ObjectReference jdiObjRef, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        if (!(jdiObjRef instanceof ArrayReference)) return null;
        return inspectIterable(
                (ArrayReference) jdiObjRef,
                jdiObjRef.uniqueID(),
                EventOuterClass.Frame.Heap.Obj.Type.ARRAY,
                jdiObjRef.referenceType().name(),
                false,
                threadReference,
                heapBuilder
        );
    }


    private static EventOuterClass.Frame.Value.Builder inspectListOrSet(ObjectReference jdiObjRef, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        try {
            var objClass = Class.forName(jdiObjRef.referenceType().name());
            if (!List.class.isAssignableFrom(objClass) && !Set.class.isAssignableFrom(objClass)) return null;
            var arrayRef = (ArrayReference) jdiObjRef.invokeMethod(
                    threadReference,
                    jdiObjRef.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );

            return inspectIterable(
                    arrayRef,
                    jdiObjRef.uniqueID(),
                    List.class.isAssignableFrom(objClass)
                            ? EventOuterClass.Frame.Heap.Obj.Type.LLIST
                            : EventOuterClass.Frame.Heap.Obj.Type.SET,
                    jdiObjRef.referenceType().name(),
                    false,
                    threadReference,
                    heapBuilder
            );
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private static EventOuterClass.Frame.Value.Builder inspectMap(ObjectReference jdiObjRef, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        try {
            var objClass = Class.forName(jdiObjRef.referenceType().name());
            if (!(Map.class.isAssignableFrom(objClass))) return null;
            var setRef = (ObjectReference) jdiObjRef.invokeMethod(
                    threadReference,
                    jdiObjRef.referenceType().methodsByName("entrySet").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            var arrayRef = (ArrayReference) setRef.invokeMethod(
                    threadReference,
                    setRef.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            heapBuilder.putReferences(jdiObjRef.uniqueID(), EventOuterClass.Frame.Heap.Obj.getDefaultInstance());
            var members = arrayRef.getValues().stream()
                    .map(v -> (ObjectReference) v)
                    .map(v -> {
                        try {
                            return EventOuterClass.Frame.Heap.Obj.Member.newBuilder()
                                    .setKey(inspectObject(
                                            v.invokeMethod(
                                                    threadReference,
                                                    v.referenceType()
                                                            .methodsByName("getKey").get(0),
                                                    List.of(),
                                                    ObjectReference.INVOKE_SINGLE_THREADED
                                            ),
                                            threadReference,
                                            heapBuilder
                                    ))
                                    .setValue(inspectObject(
                                            v.invokeMethod(
                                                    threadReference,
                                                    v.referenceType()
                                                            .methodsByName("getValue").get(0),
                                                    List.of(),
                                                    ObjectReference.INVOKE_SINGLE_THREADED
                                            ),
                                            threadReference,
                                            heapBuilder
                                    ))
                                    .build();
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            heapBuilder.putReferences(
                    jdiObjRef.uniqueID(),
                    EventOuterClass.Frame.Heap.Obj.newBuilder()
                            .setType(EventOuterClass.Frame.Heap.Obj.Type.HMAP)
                            .setLType(jdiObjRef.referenceType().name())
                            .setUserDefined(false)
                            .addAllMembers(members)
                            .build()
            );
            return EventOuterClass.Frame.Value.newBuilder()
                    .setReference(jdiObjRef.uniqueID());
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private static EventOuterClass.Frame.Value.Builder inspectUuserObject(ObjectReference jdiObjRef, ThreadReference threadReference, EventOuterClass.Frame.Heap.Builder heapBuilder) {
        var classReferenceData = jdiObjRef.referenceType().toString().split(" ");
        if (!classReferenceData[0].equals("class") || classReferenceData[1].contains(".")) return null;
        var orderedFields = jdiObjRef.referenceType().allFields();
        var fieldsValues = jdiObjRef.getValues(orderedFields);
        heapBuilder.putReferences(jdiObjRef.uniqueID(), EventOuterClass.Frame.Heap.Obj.getDefaultInstance());
        var members = orderedFields.stream()
                .map(f -> EventOuterClass.Frame.Heap.Obj.Member.newBuilder()
                        .setKey(EventOuterClass.Frame.Value.newBuilder().setStringValue(f.name()))
                        .setValue(inspectObject(fieldsValues.get(f), threadReference, heapBuilder))
                        .build()
                )
                .collect(Collectors.toList());
        heapBuilder.putReferences(
                jdiObjRef.uniqueID(),
                EventOuterClass.Frame.Heap.Obj.newBuilder()
                        .setType(EventOuterClass.Frame.Heap.Obj.Type.OTHER)
                        .setLType(jdiObjRef.referenceType().name())
                        .setUserDefined(false)
                        .addAllMembers(members)
                        .build()
        );
        return EventOuterClass.Frame.Value.newBuilder()
                .setReference(jdiObjRef.uniqueID());
    }
}

