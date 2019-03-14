package core.util;

import protobuf.EventOuterClass;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Arrays;
import java.util.List;
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
    public static EventOuterClass.Exception.Builder dump(Exception exception) {
        return dump(exception, Set.of());
    }

    /**
     * Extracts the exception data in a map.
     */
    public static EventOuterClass.Exception.Builder dump(Exception exception, Set<Integer> removeLines) {
        var tracebackWriter = new StringWriter();
        exception.printStackTrace(new PrintWriter(tracebackWriter, true));

        var formattedTraceback = Arrays.stream(tracebackWriter.toString().split("\n"))
                .map(l -> l + "\n")
                .collect(Collectors.toList());
        var filteredTraceback = IntStream.range(0, formattedTraceback.size())
                .filter(i -> !removeLines.contains(i) && !removeLines.contains(i - formattedTraceback.size()))
                .mapToObj(formattedTraceback::get)
                .collect(Collectors.toList());

        return EventOuterClass.Exception.newBuilder()
                .setType(exception.getClass().getName())
                .addAllArgs(List.of(exception.getMessage() != null ? exception.getMessage() : ""))
                .addAllTraceback(filteredTraceback);

    }

    /**
     * Creates the exception data form the received fields.
     */
    public static EventOuterClass.Exception.Builder dump(String clazz, List<String> args, String traceback) {
        return EventOuterClass.Exception.newBuilder()
                .setType(clazz)
                .addAllArgs(args)
                .addAllTraceback(
                        Arrays.stream(traceback.split("\n"))
                                .map(l -> l + "\n")
                                .collect(Collectors.toList())
                );
    }
}
