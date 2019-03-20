package core;

import core.exec.Executor;
import core.util.ThrowableUtil;
import protobuf.EventOuterClass;
import protobuf.Tracer.Action;

import java.util.Set;
import java.util.concurrent.BlockingQueue;

/**
 * Traces a java file and analyses its state after every instruction.
 */
public class Tracer {
    private BlockingQueue<Action> actionQueue;
    private BlockingQueue<EventOuterClass.Event> eventQueue;

    public Tracer(BlockingQueue<Action> actionQueue, BlockingQueue<EventOuterClass.Event> eventQueue) {
        this.actionQueue = actionQueue;
        this.eventQueue = eventQueue;
    }

    public void run() throws InterruptedException {
        try {
            var action = actionQueue.take();
            if (action.hasStop()) return;
            else if (!action.hasStart()) throw new Exception("unexpected action");

            var main = action.getStart().getMain();
            var code = action.getStart().getCode();

            var frameProcessor = new FrameProcessor(this.actionQueue, this.eventQueue);
            var project = new Project(main, code);
            project.generate();
            project.compile();
            var startedEventBuilder = EventOuterClass.Event.newBuilder();
            startedEventBuilder.getStartedBuilder().build();
            eventQueue.put(startedEventBuilder.build());
            new Executor(project, frameProcessor).execute();
        } catch (InstantiationException | IllegalArgumentException e) {
            // compilation error
            var exception = ThrowableUtil.dump(e, Set.of(-1, -2, -3, -4));
            var threwEventBuilder = EventOuterClass.Event.newBuilder();
            threwEventBuilder.getThrewBuilder().setException(exception);
            eventQueue.put(threwEventBuilder.build());
        } catch (RuntimeException e) {
            // pos compilation error
            var exception = ThrowableUtil.dump(e.getCause(), Set.of(-1, -2, -3, -4));
            var threwEventBuilder = EventOuterClass.Event.newBuilder();
            threwEventBuilder.getThrewBuilder().setException(exception);
            eventQueue.put(threwEventBuilder.build());
        } catch (Exception e) {
            // inspection error
            var exception = ThrowableUtil.dump(e);
            var threwEventBuilder = EventOuterClass.Event.newBuilder();
            threwEventBuilder.getThrewBuilder().setException(exception);
            eventQueue.put(threwEventBuilder.build());
        }
    }
}