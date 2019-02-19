package message;

/**
 * Action message type.
 */
public class ResultMessage extends Message {
    private Result name;

    public ResultMessage(Result name, Object value) {
        super(value);
        this.name = name;
    }

    public Result getName() {
        return name;
    }

    /**
     * List of results of the tracer.
     */
    public enum Result {
        started,
        error,
        data,
        print,
        prompt,
        locked
    }
}

