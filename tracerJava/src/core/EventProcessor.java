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
//                var frames = step.thread().frames();
//                var frame0 = frames.get(0);
//                var frame = frames.get(frames.size() - 1);
//                System.out.println(frames.size());
//                System.out.println(frame0.getArgumentValues());
//                System.out.println(frame.getArgumentValues());
//
//                var variables = frame.visibleVariables();
//                var variable0 = variables.get(0);
//                var variable = variables.get(variables.size() - 1);
//                System.out.println(variables.size());
//                System.out.println(variables);
//                System.out.println(variable.name());
//                System.out.println(variable.signature());
//                System.out.println(variable.genericSignature());
//                System.out.println(variable.typeName());
//
//                Value value = frame.getValue(variable);
//                System.out.println(value.type());
//                if (value instanceof ArrayReference) {
//                    var arr = (ArrayReference) value;
//                    System.out.print("[");
//                    arr.getValues().forEach(v -> System.out.print(v + ", "));
//                    System.out.println("]");
//                } else if (value instanceof ObjectReference) {
//                    var obj = (ObjectReference) value;
//                    System.out.println("obj type");
//                    System.out.println(obj.type().name());
//                    if (Class.forName(obj.type().name()).isAssignableFrom(Map.class)) {
//                        Method entrySet = ((ReferenceType) obj.type()).methodsByName("entrySet").get(0);
//                        var set = obj.invokeMethod(obj.owningThread(), entrySet, List.of(), ObjectReference.INVOKE_SINGLE_THREADED);
//                        System.out.println(set);
//                    }
//                }
//                System.out.println(value.toString());

        } catch (IncompatibleThreadStateException e) {
            e.printStackTrace();
        }
//        catch (AbsentInformationException e) {
//            e.printStackTrace();
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//
//        } catch (ClassNotLoadedException e) {
//            e.printStackTrace();
//        } catch (InvocationException e) {
//            e.printStackTrace();
//        } catch (InvalidTypeException e) {
//            e.printStackTrace();
//        }
    }
}
