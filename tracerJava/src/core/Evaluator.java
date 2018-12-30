package core;

import com.sun.jdi.event.LocatableEvent;
import core.util.ExceptionUtil;

/**
 * Evaluates an expression in an event scope.
 */
public final class Evaluator {

    private Evaluator() {
    }

    /**
     * Evaluates expressions against the frame scope, process possible exceptions if any is thrown.
     * The expression is able to mutate the script state.
     */
    public static Object evaluate(LocatableEvent event, String expression) {
        try {
            throw new UnsupportedOperationException("evaluation not implemented");
        } catch (Exception e) {
            return ExceptionUtil.dump(e);
        }
    }
}
