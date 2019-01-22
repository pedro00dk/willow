package core.util;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

/**
 * Processes exception objects.
 */
public final class ExceptionUtil {

    private ExceptionUtil() {
    }

    /**
     * Extracts the exception data in a map.
     */
    public static Map<String, Object> dump(Exception exception) {
        var tracebackWriter = new StringWriter();
        exception.printStackTrace(new PrintWriter(tracebackWriter, true));
        return Map.ofEntries(
                Map.entry("type", exception.getClass().getName()),
                Map.entry("args", List.of(exception.getMessage())),
                Map.entry("traceback", tracebackWriter.toString())
        );
    }
}
