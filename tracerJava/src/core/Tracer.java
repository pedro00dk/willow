package core;

import core.exec.Executor;
import core.util.ExceptionUtil;
import message.ActionMessage;
import message.ResultMessage;

import java.util.concurrent.BlockingQueue;

/**
 * Traces a java file and analyses its state after every instruction.
 */
public class Tracer {
    private Project project;
    private BlockingQueue<ActionMessage> actionQueue;
    private BlockingQueue<ResultMessage> resultQueue;

    /**
     * Initializes the tracer with the java filename, its contents and action/result queues.
     */
    public Tracer(String filename, String code, BlockingQueue<ActionMessage> actionQueue, BlockingQueue<ResultMessage> resultQueue) {
        this.project = new Project(filename, code);
        this.actionQueue = actionQueue;
        this.resultQueue = resultQueue;
    }

    /**
     * Configures and runs the tracer.
     */
    public void run() {
        var eventProcessor = new EventProcessor(this.actionQueue, this.resultQueue);
        try {
            actionQueue.take();
            project.generate();
            project.compile();
            resultQueue.put(new ResultMessage(ResultMessage.Result.started, null));
            new Executor(project, eventProcessor).execute();
        } catch (Exception e) {
            var exceptionDump = ExceptionUtil.dump(e);
            try {
                resultQueue.put(new ResultMessage(ResultMessage.Result.error, exceptionDump));
            } catch (InterruptedException e1) {
                e1.printStackTrace();
            }
        }
    }
}
