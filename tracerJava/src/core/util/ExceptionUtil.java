package core.util;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
        return dump(exception, Set.of());
    }

    /**
     * Extracts the exception data in a map.
     */
    public static Map<String, Object> dump(Exception exception, Set<Integer> removeLines) {
        var tracebackWriter = new StringWriter();
        exception.printStackTrace(new PrintWriter(tracebackWriter, true));

        var tracebackLines = Arrays.stream(tracebackWriter.toString().split("\n"))
                .map(l -> l + "\n")
                .collect(Collectors.toList());
        var formattedTraceback = IntStream.range(0, tracebackLines.size())
                .filter(i -> !removeLines.contains(i) && !removeLines.contains(i - tracebackLines.size()))
                .mapToObj(tracebackLines::get)
                .collect(Collectors.toList());

        return Map.ofEntries(
                Map.entry("type", exception.getClass().getName()),
                Map.entry("args", List.of(exception.getMessage() != null ? exception.getMessage() : "")),
                Map.entry("traceback", formattedTraceback)
        );
    }
}
