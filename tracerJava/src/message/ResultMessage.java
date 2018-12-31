package message;

/**
 * Action message type.
 */
public class ResultMessage extends Message {
    private Result result;

    public ResultMessage(Result result, Object value) {
        super(value);
        this.result = result;
    }

    public Result getResult() {
        return result;
    }

    /**
     * List of results of the tracer.
     */
    public enum Result {
        STARTED,
        ERROR,
        DATA,
        PRODUCT,
        PRINT,
        PROMPT,
        LOCKED
    }
}

