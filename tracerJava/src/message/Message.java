package message;

/**
 * Stores message data.
 */
public abstract class Message {
    protected Object value;


    public Message(Object value) {
        this.value = value;
    }

    public Object getValue() {
        return value;
    }
}
