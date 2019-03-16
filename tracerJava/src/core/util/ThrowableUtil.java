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
 * Processes throwable objects.
 */
public final class ThrowableUtil {

    private ThrowableUtil() {
    }

    /**
     * Extracts the throwable data in a map.
     */
    public static EventOuterClass.Exception.Builder dump(Throwable throwable) {
        return dump(throwable, Set.of());
    }

    /**
     * Extracts the throwable data in a map.
     */
    public static EventOuterClass.Exception.Builder dump(Throwable throwable, Set<Integer> removeLines) {
        var tracebackWriter = new StringWriter();
        throwable.printStackTrace(new PrintWriter(tracebackWriter, true));

        var formattedTraceback = Arrays.stream(tracebackWriter.toString().split("\n"))
                .map(l -> l + "\n")
                .collect(Collectors.toList());
        var filteredTraceback = IntStream.range(0, formattedTraceback.size())
                .filter(i -> !removeLines.contains(i) && !removeLines.contains(i - formattedTraceback.size()))
                .mapToObj(formattedTraceback::get)
                .collect(Collectors.toList());

        return EventOuterClass.Exception.newBuilder()
                .setType(throwable.getClass().getName())
                .addAllArgs(List.of(throwable.getMessage() != null ? throwable.getMessage() : ""))
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
