package message;

/**
 * Action message type.
 */
public class ActionMessage extends Message {
    private Action name;

    public ActionMessage(Action name, Object value) {
        super(value);
        this.name = name;
    }

    public Action getName() {
        return name;
    }

    /**
     * List of available actions that can be sent to the tracer.
     */
    public enum Action {
        start,
        stop,
        input,
        step
    }
}
