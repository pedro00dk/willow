import com.sun.jdi.*;
import com.sun.jdi.event.*;
import protobuf.SnapshotOuterClass;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Inspects the received event, building a snapshot from it.
 */
public final class Inspector {

    public SnapshotOuterClass.Snapshot.Builder inspect(Event event, SnapshotOuterClass.Snapshot previousSnapshot) throws IncompatibleThreadStateException {
        SnapshotOuterClass.Snapshot.Builder snapshotBuilder = SnapshotOuterClass.Snapshot.newBuilder();
        if (event instanceof MethodEntryEvent)
            snapshotBuilder.setType(SnapshotOuterClass.Snapshot.Type.CALL);
        else if (event instanceof MethodExitEvent || event instanceof ThreadDeathEvent)
            snapshotBuilder.setType(SnapshotOuterClass.Snapshot.Type.RETURN);
        else if (event instanceof ExceptionEvent)
            snapshotBuilder.setType(SnapshotOuterClass.Snapshot.Type.EXCEPTION);
        else
            snapshotBuilder.setType(SnapshotOuterClass.Snapshot.Type.LINE);

        if (event instanceof ThreadDeathEvent && previousSnapshot.hasException())
            return previousSnapshot.toBuilder()
                    .setType(SnapshotOuterClass.Snapshot.Type.RETURN)
                    .setFinish(true)
                    .clearException();

        // Get frames may fail when debugging this debugger
        var frames = ((LocatableEvent) event).thread().frames();
        var scopesBuilders = frames.stream()
                .map(StackFrame::location)
                .map(l -> snapshotBuilder.addStackBuilder().setLine(l.lineNumber()).setName(l.method().name()))
                .collect(Collectors.toList());

        var threadReference = frames.get(0).thread();
        var scopeIndex = new AtomicInteger(0);
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
                    var visibleVariables = e.getKey();
                    var variablesValues = e.getValue();
                    var scopeBuilder = snapshotBuilder.getStackBuilder(scopeIndex.getAndIncrement());
                    visibleVariables
                            .forEach(variable -> scopeBuilder.addVariablesBuilder()
                                    .setName(variable.name())
                                    .setValue(inspectObject(
                                            snapshotBuilder, variablesValues.get(variable), threadReference)
                                    ));
                });

        if (snapshotBuilder.getType() == SnapshotOuterClass.Snapshot.Type.EXCEPTION && event instanceof ExceptionEvent) {
            var exceptionEvent = (ExceptionEvent) event;
            var exceptionMessage = ((StringReference) exceptionEvent.exception().getValue(
                    exceptionEvent.exception().referenceType().fieldByName("detailMessage")
            )).value();
            snapshotBuilder.setException(Util.dump(
                    exceptionEvent.exception().referenceType().name(),
                    List.of(exceptionMessage),
                    exceptionMessage
            ));
        }
        snapshotBuilder.setFinish(
                snapshotBuilder.getType() == SnapshotOuterClass.Snapshot.Type.RETURN &&
                        snapshotBuilder.getStackBuilderList().size() == 1
        );
        return snapshotBuilder;
    }

    private static SnapshotOuterClass.Value.Builder inspectObject(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, Value jdiValue, ThreadReference threadReference) {
        if (jdiValue == null) return SnapshotOuterClass.Value.newBuilder().setOther("null");
        var value = inspectPrimitive(jdiValue);
        if (value != null) return value;
        value = inspectString(jdiValue);
        if (value != null) return value;

        if (!(jdiValue instanceof ObjectReference)) return SnapshotOuterClass.Value.newBuilder().setOther("unknown");
        var jdiObject = (ObjectReference) jdiValue;
        value = inspectBoxed(jdiObject);
        if (value != null) return value;
        value = inspectArray(snapshotBuilder, jdiObject, threadReference);
        if (value != null) return value;
        value = inspectListOrSet(snapshotBuilder, jdiObject, threadReference);
        if (value != null) return value;
        value = inspectMap(snapshotBuilder, jdiObject, threadReference);
        if (value != null) return value;
        value = inspectUuserObject(snapshotBuilder, jdiObject, threadReference);
        if (value != null) return value;

        return SnapshotOuterClass.Value.newBuilder().setOther(jdiObject.referenceType().name());
    }

    private static SnapshotOuterClass.Value.Builder inspectPrimitive(Value jdiValue) {
        if (jdiValue instanceof PrimitiveValue) {
            var valueBuilder = SnapshotOuterClass.Value.newBuilder();
            if (jdiValue instanceof BooleanValue) valueBuilder.setBoolean(((BooleanValue) jdiValue).value());
            else if (jdiValue instanceof CharValue)
                valueBuilder.setString(Character.toString(((CharValue) jdiValue).value()));
            else if (jdiValue instanceof ByteValue) valueBuilder.setInteger(((ByteValue) jdiValue).value());
            else if (jdiValue instanceof ShortValue) valueBuilder.setInteger(((ShortValue) jdiValue).value());
            else if (jdiValue instanceof IntegerValue) valueBuilder.setInteger(((IntegerValue) jdiValue).value());
            else if (jdiValue instanceof LongValue)
                valueBuilder.setOther(String.valueOf(((LongValue) jdiValue).value()));
            else if (jdiValue instanceof FloatValue) valueBuilder.setFloat(((FloatValue) jdiValue).value());
            else if (jdiValue instanceof DoubleValue) valueBuilder.setFloat(((DoubleValue) jdiValue).value());
            else return null;
            return valueBuilder;
        }
        return null;
    }

    private static SnapshotOuterClass.Value.Builder inspectString(Value jdiValue) {
        if (!(jdiValue instanceof StringReference)) return null;
        return SnapshotOuterClass.Value.newBuilder()
                .setString(((StringReference) jdiValue).value());
    }

    private static SnapshotOuterClass.Value.Builder inspectBoxed(ObjectReference jdiObject) {
        try {
            var objClass = Class.forName(jdiObject.referenceType().name());
            if (Boolean.class.isAssignableFrom(objClass) || Character.class.isAssignableFrom(objClass) ||
                    Byte.class.isAssignableFrom(objClass) || Short.class.isAssignableFrom(objClass) ||
                    Integer.class.isAssignableFrom(objClass) || Long.class.isAssignableFrom(objClass) ||
                    Float.class.isAssignableFrom(objClass) || Double.class.isAssignableFrom(objClass)) {
                var primitiveValue = jdiObject.getValue(jdiObject.referenceType().fieldByName("value"));
                return inspectPrimitive(primitiveValue);
            }
        } catch (ClassNotFoundException e) {
            // array types always throw this exception
        }
        return null;
    }

    private static SnapshotOuterClass.Value.Builder inspectIterable(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, ArrayReference arrayRef, String reference, SnapshotOuterClass.Obj.Type type, String languageType, boolean userDefined, ThreadReference threadReference) {
        var memberIndex = new AtomicInteger();
        // add reference to heap graph (it has to be added before other objects inspections)
        snapshotBuilder.putHeap(reference, SnapshotOuterClass.Obj.getDefaultInstance());
        var objBuilder = SnapshotOuterClass.Obj.newBuilder();
        objBuilder.setType(type).setLanguageType(languageType).setUserDefined(userDefined);
        arrayRef.getValues()
                .forEach(v -> {
                    var memberBuilder = objBuilder.addMembersBuilder();
                    memberBuilder.getKeyBuilder().setInteger(memberIndex.getAndIncrement());
                    memberBuilder.setValue(inspectObject(snapshotBuilder, v, threadReference).build());
                });
        snapshotBuilder.putHeap(reference, objBuilder.build());
        return SnapshotOuterClass.Value.newBuilder().setReference(reference);
    }

    private static SnapshotOuterClass.Value.Builder inspectArray(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, ObjectReference jdiObject, ThreadReference threadReference) {
        if (!(jdiObject instanceof ArrayReference)) return null;
        return inspectIterable(
                snapshotBuilder,
                (ArrayReference) jdiObject,
                Long.toString(jdiObject.uniqueID()),
                SnapshotOuterClass.Obj.Type.ARRAY,
                jdiObject.referenceType().name(),
                false,
                threadReference
        );
    }

    private static SnapshotOuterClass.Value.Builder inspectListOrSet(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, ObjectReference jdiObject, ThreadReference threadReference) {
        try {
            var objClass = Class.forName(jdiObject.referenceType().name());
            if (!List.class.isAssignableFrom(objClass) && !Set.class.isAssignableFrom(objClass)) return null;
            var arrayRef = (ArrayReference) jdiObject.invokeMethod(
                    threadReference,
                    jdiObject.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            return inspectIterable(
                    snapshotBuilder,
                    arrayRef,
                    Long.toString(jdiObject.uniqueID()),
                    ArrayList.class.isAssignableFrom(objClass) || Vector.class.isAssignableFrom(objClass)
                            ? SnapshotOuterClass.Obj.Type.ALIST
                            : LinkedList.class.isAssignableFrom(objClass)
                            ? SnapshotOuterClass.Obj.Type.LLIST
                            : SnapshotOuterClass.Obj.Type.SET,
                    jdiObject.referenceType().name(),
                    false,
                    threadReference
            );
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private static SnapshotOuterClass.Value.Builder inspectMap(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, ObjectReference jdiObject, ThreadReference threadReference) {
        try {
            var objClass = Class.forName(jdiObject.referenceType().name());
            if (!(Map.class.isAssignableFrom(objClass))) return null;
            var setRef = (ObjectReference) jdiObject.invokeMethod(
                    threadReference,
                    jdiObject.referenceType().methodsByName("entrySet").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            var arrayRef = (ArrayReference) setRef.invokeMethod(
                    threadReference,
                    setRef.referenceType().methodsByName("toArray", "()[Ljava/lang/Object;").get(0),
                    List.of(),
                    ObjectReference.INVOKE_SINGLE_THREADED
            );
            var reference = Long.toString(jdiObject.uniqueID());
            // add reference to heap graph (it has to be added before other objects inspections)
            snapshotBuilder.putHeap(reference, SnapshotOuterClass.Obj.getDefaultInstance());
            var objBuilder = SnapshotOuterClass.Obj.newBuilder();
            objBuilder
                    .setType(SnapshotOuterClass.Obj.Type.HMAP)
                    .setLanguageType(jdiObject.referenceType().name())
                    .setUserDefined(false);
            arrayRef.getValues().stream()
                    .map(v -> (ObjectReference) v)
                    .forEach(v -> {
                        var memberBuilder = objBuilder.addMembersBuilder();
                        try {
                            memberBuilder.setKey(inspectObject(
                                    snapshotBuilder,
                                    v.invokeMethod(
                                            threadReference,
                                            v.referenceType().methodsByName("getKey").get(0),
                                            List.of(),
                                            ObjectReference.INVOKE_SINGLE_THREADED
                                    ),
                                    threadReference
                            ).build());
                            memberBuilder.setValue(inspectObject(
                                    snapshotBuilder,
                                    v.invokeMethod(
                                            threadReference,
                                            v.referenceType().methodsByName("getValue").get(0),
                                            List.of(),
                                            ObjectReference.INVOKE_SINGLE_THREADED
                                    ),
                                    threadReference
                            ).build());

                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
            snapshotBuilder.putHeap(reference, objBuilder.build());
            return SnapshotOuterClass.Value.newBuilder().setReference(reference);
        } catch (ClassNotFoundException | InvalidTypeException | ClassNotLoadedException | IncompatibleThreadStateException | InvocationException e) {
            // ignore errors
        }
        return null;
    }

    private static SnapshotOuterClass.Value.Builder inspectUuserObject(SnapshotOuterClass.Snapshot.Builder snapshotBuilder, ObjectReference jdiObject, ThreadReference threadReference) {
        var classReferenceData = jdiObject.referenceType().toString().split(" ");
        if (!classReferenceData[0].equals("class") || classReferenceData[1].contains(".")) return null;
        var orderedFields = jdiObject.referenceType().allFields();
        var fieldsValues = jdiObject.getValues(orderedFields);
        var reference = Long.toString(jdiObject.uniqueID());
        // add reference to heap graph (it has to be added before other objects inspections)
        snapshotBuilder.putHeap(reference, SnapshotOuterClass.Obj.getDefaultInstance());
        var objBuilder = SnapshotOuterClass.Obj.newBuilder();
        orderedFields
                .forEach(f -> {
                    var memberBuilder = objBuilder.addMembersBuilder();
                    memberBuilder.getKeyBuilder().setString(f.name());
                    memberBuilder.setValue(inspectObject(snapshotBuilder, fieldsValues.get(f), threadReference).build());
                });

        snapshotBuilder.putHeap(reference, objBuilder.build());
        return SnapshotOuterClass.Value.newBuilder().setReference(reference);
    }
}

