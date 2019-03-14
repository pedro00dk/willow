package core;

import protobuf.EventOuterClass;
import protobuf.Tracer.Action;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;


/**
 * Provides an easy interface for communication with the Tracer as it has to run in another process.
 */
public class Client {
    private String filename;
    private String code;
    private BlockingQueue<Action> actionQueue;
    private BlockingQueue<EventOuterClass.Event> eventQueue;
    private Thread tracerThread;

    public boolean isTracerRunning() {
        return tracerThread != null;
    }

    public List<EventOuterClass.Event> demultiplexAction(Action action) throws Exception {
        if (action.hasStart()) return start(action);
        else if (action.hasStop()) {
            stop(action);
            return null;
        } else if (action.hasStep()) return step(action);
        else if (action.hasInput()) {
            input(action);
            return null;
        } else throw new Exception("action has no sub-action");
    }

    public List<EventOuterClass.Event> start(Action startAction) throws InterruptedException {
        if (isTracerRunning()) throw new IllegalStateException("tracer already running");
        if (!startAction.hasStart()) throw new IllegalArgumentException("action has no expected sub-action");

        actionQueue = new LinkedBlockingDeque<>();
        eventQueue = new LinkedBlockingDeque<>();
        tracerThread = new Thread(() -> {
            try {
                new Tracer(actionQueue, eventQueue).run();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
        tracerThread.start();

        var events = new ArrayList<EventOuterClass.Event>();
        actionQueue.put(startAction);
        while (true) {
            var event = eventQueue.take();
            events.add(event);
            if (event.hasStarted() || event.hasThrew() || event.hasLocked()) break;
        }
        if (events.get(events.size() - 1).hasThrew()) {
            var stopActionBuilder = Action.newBuilder();
            stopActionBuilder.getStopBuilder().build();
            this.stop(stopActionBuilder.build());
        }
        return events;
    }

    public void stop(Action stopAction) throws InterruptedException {
        if (!isTracerRunning()) throw new IllegalStateException("tracer already stopped");
        if (!stopAction.hasStop()) throw new IllegalArgumentException("action has no expected sub-action");

        actionQueue.put(stopAction);
        tracerThread.join();
        tracerThread = null;
        actionQueue = null;
        eventQueue = null;
    }

    public List<EventOuterClass.Event> step(Action stepAction) throws InterruptedException {
        if (!isTracerRunning()) throw new IllegalStateException("tracer not running");
        if (!stepAction.hasStep()) throw new IllegalArgumentException("action has no expected sub-action");

        var events = new ArrayList<EventOuterClass.Event>();
        actionQueue.put(stepAction);
        while (true) {
            var event = eventQueue.take();
            events.add(event);
            if (event.hasInspected() || event.hasThrew() || event.hasLocked()) break;
        }
        var lastEvent = events.get(events.size() - 1);
        if (lastEvent.hasThrew() || lastEvent.hasInspected() && lastEvent.getInspected().getFrame().getFinish()) {
            var stopActionBuilder = Action.newBuilder();
            stopActionBuilder.getStopBuilder().build();
            this.stop(stopActionBuilder.build());
        }
        return events;
    }

    public void input(Action inputAction) throws InterruptedException {
        if (!isTracerRunning()) throw new IllegalStateException("tracer not running");
        if (!inputAction.hasInput()) throw new IllegalArgumentException("action has no expected sub-action");

        actionQueue.put(inputAction);
    }
}
