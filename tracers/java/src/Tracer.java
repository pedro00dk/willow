import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sun.jdi.event.*;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaFileObject;
import javax.tools.ToolProvider;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;


/**
 * Builds exception dicts from objects.
 */
final class DumpException {

    /**
     * Builds exception dicts from objects.
     */
    static JsonObject dump(String clazz) {
        var traceback = new JsonArray();
        traceback.add("");
        var exception = new JsonObject();
        exception.addProperty("type", clazz);
        exception.add("traceback", traceback);
        return exception;
    }

    static JsonObject dump(Throwable throwable, Set<Integer> removeLines) {
        var tracebackWriter = new StringWriter();
        throwable.printStackTrace(new PrintWriter(tracebackWriter, true));

        var args = new JsonArray();
        if (throwable.getMessage() != null) args.add(throwable.getMessage());

        var formattedTraceback = Arrays
                .stream(tracebackWriter.toString().split("\n"))
                .map(l -> l + "\n")
                .collect(Collectors.toList());

        var traceback = IntStream
                .range(0, formattedTraceback.size())
                .filter(i -> !removeLines.contains(i) && !removeLines.contains(i - formattedTraceback.size()))
                .mapToObj(formattedTraceback::get)
                .collect(JsonArray::new, JsonArray::add, (line0, line1) -> {
                    throw new RuntimeException("parallel stream not allowed");
                });

        var exception = new JsonObject();
        exception.addProperty("type", throwable.getClass().getName());
        exception.add("traceback", traceback);
        return exception;
    }
}

/**
 * Exception set by the tracer to stop executing the debugee application, indicating some internal stop condition.
 * (not application fail)
 */
class TracerStopException extends Exception {

    TracerStopException(String message) {
        super(message);
    }
}

/**
 * Exception to represent application exceptions not catchable in the default tracing process.
 * (ex.: no main method found -> sent as error in standard error stream)
 */
class ApplicationExternalException extends Exception {

    ApplicationExternalException(String message) {
        super(message);
    }
}

/**
 * Traces a java file and analyses its state after each instruction.
 */
public class Tracer {
    private String source;
    private String input;
    private int steps;
    private String filename;

    private Inspector inspector;
    private JsonObject result;

    private Event previousEvent;
    private JsonObject previousSnapshot;
    private int currentStep;
    private List<String> printCache;

    public Tracer(JsonObject trace) {
        this.source = trace.get("source").getAsString();
        this.input = trace.get("input").getAsString();
        this.steps = trace.get("steps").getAsNumber().intValue();
        this.filename = getMainFilename(this.source);
        inspector = new Inspector();
        result = null;
        previousEvent = null;
        previousSnapshot = null;
        currentStep = 0;
        printCache = new ArrayList<>();
    }

    private String getMainFilename(String code) {
        var commentStringRegex = Pattern
                .compile(
                        "(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/|[\\t]*//.*)|\"(\\\\.|[^\\\\\"])*\"|'(\\\\[\\s\\S]|[^'])*'"
                );
        code = commentStringRegex.matcher(code).replaceAll("");

        var classRegex = Pattern.compile("(public\\s+class\\s+([A-Za-z][A-Za-z0-9_]*))");
        var classMatcher = classRegex.matcher(code);
        var classesIndicesNames = IntStream
                .generate(() -> 0)
                .takeWhile(i -> classMatcher.find())
                .mapToObj(i -> Map.entry(classMatcher.start(), classMatcher.group(2)))
                .collect(Collectors.toList());

        var mainMethodRegex = Pattern.compile("(public\\s+static\\s+void\\s+main\\s*\\(.*\\))");
        var mainMethodMatcher = mainMethodRegex.matcher(code);
        var mainMethodIndices = IntStream
                .generate(() -> 0)
                .takeWhile(i -> mainMethodMatcher.find())
                .map(i -> mainMethodMatcher.start())
                .boxed()
                .collect(Collectors.toList());

        if (classesIndicesNames.isEmpty()) return "Main.java";
        else if (mainMethodIndices.isEmpty()) return classesIndicesNames.get(0).getValue() + ".java";
        else {
            var mainIndex = mainMethodIndices.get(0);
            var classesBeforeMain = classesIndicesNames
                    .stream()
                    .filter(classIndexName -> classIndexName.getKey() < mainIndex)
                    .collect(Collectors.toList());
            if (!classesBeforeMain.isEmpty()) return classesBeforeMain.get(0).getValue() + ".java";
            else return classesIndicesNames.get(0).getValue() + ".java";
        }
    }

    private Path generateProject(String filename, String source) throws Exception {
        var path = Files.createTempDirectory("");
        if (source.isBlank()) {
            throw new Exception("Compilation fail:\nUnable to create class from empty file.\n");
        }
        var srcPath = Paths.get(path.toString(), "src/");
        Files.createDirectory(srcPath);
        var mainPath = Paths.get(srcPath.toString(), filename);
        Files.writeString(mainPath, source);
        return path;
    }

    private void compileProject(Path path, String filename) throws Exception {
        var srcPath = Paths.get(path.toString(), "src/");
        var mainPath = Paths.get(srcPath.toString(), filename);
        var binPath = Paths.get(path.toString(), "bin/");
        Files.createDirectory(binPath);
        var compiler = ToolProvider.getSystemJavaCompiler();
        var dgCollector = new DiagnosticCollector<JavaFileObject>();
        var fileManager = compiler.getStandardFileManager(dgCollector, Locale.ENGLISH, StandardCharsets.UTF_8);
        var projectFiles = Stream.of(mainPath).map(p -> p.toAbsolutePath().toString()).toArray(String[]::new);
        var javaFiles = fileManager.getJavaFileObjects(projectFiles);
        var javacOptions = List.of("-d", binPath.toString(), "-cp", srcPath.toString(), "-g", "-proc:none");
        var output = new StringWriter();
        var task = compiler.getTask(output, fileManager, dgCollector, javacOptions, null, javaFiles);
        if (!task.call()) {
            var diagnostic = dgCollector.getDiagnostics().stream()
                    .map(Diagnostic::toString)
                    .collect(Collectors.joining("\n", "\n", "\n"));
            throw new Exception("Compilation fail:\n" + output.toString() + diagnostic);
        }
    }

    JsonObject run() {
        result = new JsonObject();
        result.add("steps", new JsonArray());

        // generation and compilation
        Path path;
        try {
            path = generateProject(filename, source);
            compileProject(path, filename);
        } catch (Exception e) {
            // These exceptions are not caused by the application, hence they use the cause field instead of exception
            var threw = new JsonObject();
            threw.add("exception", DumpException.dump(e, Set.of(-1, -2, -3)));
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
            return result;
        }

        try {
            new Executor().execute(path, filename, this::trace, this::inputHook, this::printHook, this::lockHook);
        } catch (TracerStopException e) {
            // TracerStopException is generated by the tracer to stop the executor
            // These exceptions are not caused by the application, hence they use the cause field instead of exception
            var threw = new JsonObject();
            threw.addProperty("cause", e.getMessage());
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
        } catch (ApplicationExternalException e) {
            var threw = new JsonObject();
            threw.add("exception", DumpException.dump(e, Set.of(-1, -2, -3, -4)));
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
        } catch (Exception e) {
            var threw = new JsonObject();
            threw.add("exception", DumpException.dump(e, Set.of()));
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);


            // {"source": "public class Main{}"}
            // {"source": "public class Main{"}
        }
        return result;
    }

    private void trace(Event event) {
        if (
                event instanceof VMStartEvent ||
                        event instanceof VMDeathEvent ||
                        event instanceof VMDisconnectEvent ||
                        event instanceof ThreadStartEvent ||
                        // uncaught exceptions are followed by a ThreadDeathEvent
                        event instanceof ThreadDeathEvent && !(previousEvent instanceof ExceptionEvent)
        ) {
            if (this.printCache.isEmpty()) return;
            var printCache = this.printCache;
            this.printCache = new ArrayList<>();
            throw new RuntimeException(new ApplicationExternalException(String.join("\n", printCache)));
        }

        this.currentStep++;
        if (this.currentStep > this.steps)
            throw new RuntimeException(new TracerStopException("reached maximum step: " + this.steps));

        InspectionResult inspectionResult;
        try {
            inspectionResult = inspector.inspect(event, previousEvent, previousSnapshot);
            var step = new JsonObject();
            step.add("snapshot", inspectionResult.snapshot);
            result.get("steps").getAsJsonArray().add(step);
            if (inspectionResult.threw != null) {
                var threwStep = new JsonObject();
                threwStep.add("threw", inspectionResult.threw);
                result.get("steps").getAsJsonArray().add(threwStep);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        var steps = result.get("steps").getAsJsonArray();
        steps.get(steps.size() - 1).getAsJsonObject().add(
                "prints",
                printCache.stream()
                        .collect(() -> new JsonArray(printCache.size()), JsonArray::add, (print0, print1) -> {
                            throw new RuntimeException("parallel stream not allowed");
                        })
        );
        this.printCache = new ArrayList<>();
        this.previousEvent = event;
        this.previousSnapshot = inspectionResult.snapshot;
    }

    private String inputHook() {
        return this.input;
    }

    private void printHook(String text) {
        this.printCache.add(text);
    }

    private void lockHook(String cause) {
        throw new RuntimeException(new TracerStopException("not enough input or slow function call"));
    }
}
