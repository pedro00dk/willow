import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sun.jdi.IncompatibleThreadStateException;
import com.sun.jdi.event.*;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaFileObject;
import javax.tools.ToolProvider;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        this.steps = trace.get("steps").getAsInt();
        this.filename = getMainFilename(this.source);
        inspector = new Inspector();
        result = null;
        currentStep = 0;
        previousEvent = null;
        previousSnapshot = null;
        printCache = new ArrayList<>();
    }

    private String getMainFilename(String code) {
        var commentStringRegex = Pattern
                .compile("(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/|[\\t]*//.*)|\"(\\\\.|[^\\\\\"])*\"|'(\\\\[\\s\\S]|[^'])*'");
        code = commentStringRegex.matcher(code).replaceAll("");

        var classRegex = Pattern.compile("(public\\s+class\\s+([A-Za-z][A-Za-z0-9_]*))");
        var classMatcher = classRegex.matcher(code);

        var classesIndicesNames = Stream.generate(classMatcher::find)
                .takeWhile(found -> found)
                .map(found -> Map.entry(classMatcher.start(), classMatcher.group(2)))
                .collect(Collectors.toList());

        var mainMethodRegex = Pattern.compile("(public\\s+static\\s+void\\s+main\\s*\\(.*\\))");
        var mainMethodMatcher = mainMethodRegex.matcher(code);
        var mainMethodIndices = Stream.generate(mainMethodMatcher::find)
                .takeWhile(found -> found)
                .map(f -> mainMethodMatcher.start())
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

    private Path generateProject(String filename, String source) throws IOException, ApplicationExternalException {
        var path = Files.createTempDirectory("");
        if (source.isBlank()) // javac does not fail with empty files, but produces no output
            throw new ApplicationExternalException("Compilation fail:\nUnable to create class from empty file.\n");
        var srcPath = Paths.get(path.toString(), "src/");
        Files.createDirectory(srcPath);
        var mainPath = Paths.get(srcPath.toString(), filename);
        Files.writeString(mainPath, source);
        return path;
    }

    private void compileProject(Path path, String filename) throws IOException, ApplicationExternalException {
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
            throw new ApplicationExternalException("Compilation fail:\n" + output.toString() + diagnostic);
        }
    }

    JsonObject run() {
        result = new JsonObject();
        result.add("steps", new JsonArray());

        Path path;
        try {
            path = generateProject(filename, source);
            compileProject(path, filename);
        } catch (ApplicationExternalException e) {
            var threw = new JsonObject();
            threw.addProperty("cause", e.getMessage());
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
            return result;
        } catch (IOException e) {
            var threw = new JsonObject();
            threw.add("exception", Inspector.JsonException.fromThrowable(e, Set.of()));
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
            return result;
        }

        try {
            new Executor().execute(path, filename, this::trace, this::inputHook, this::printHook, this::lockHook);
        } catch (TracerStopException e) {
            var threw = new JsonObject();
            threw.addProperty("cause", e.getMessage());
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
        } catch (ApplicationExternalException e) {
            var threw = new JsonObject();
            threw.addProperty("cause", e.getMessage());
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
            return result;
        } catch (Exception e) {
            var threw = new JsonObject();
            threw.add("exception", Inspector.JsonException.fromThrowable(e, Set.of()));
            var step = new JsonObject();
            step.add("threw", threw);
            result.get("steps").getAsJsonArray().add(step);
        }
        return result;
    }

    private void trace(Event event) throws ApplicationExternalException, TracerStopException, IncompatibleThreadStateException {
        if (
                event instanceof VMStartEvent ||
                        event instanceof VMDeathEvent ||
                        event instanceof VMDisconnectEvent ||
                        event instanceof ThreadStartEvent ||
                        // uncaught exceptions are followed by a ThreadDeathEvent (not matching this case)
                        event instanceof ThreadDeathEvent && !(previousEvent instanceof ExceptionEvent)
        ) {
            if (this.printCache.isEmpty()) return;
            var printCache = this.printCache;
            this.printCache = new ArrayList<>();
            throw new ApplicationExternalException(String.join("\n", printCache));
        }

        this.currentStep++;
        if (this.currentStep > this.steps)
            throw new TracerStopException("reached maximum step: " + this.steps);

        var steps = result.get("steps").getAsJsonArray();
        var snapshotThrew = inspector.inspect(event, previousEvent, previousSnapshot);
        var prints = printCache.stream().sequential().collect(
                () -> new JsonArray(printCache.size()), JsonArray::add, (print0, print1) -> {
                    throw new RuntimeException("parallel stream not allowed");
                }
        );
        this.printCache = new ArrayList<>();
        var step = new JsonObject();
        step.add("snapshot", snapshotThrew.snapshot);
        step.add("prints", snapshotThrew.threw == null ? prints : new JsonArray());
        steps.add(step);

        if (snapshotThrew.threw != null) {
            var threwStep = new JsonObject();
            threwStep.add("threw", snapshotThrew.threw);
            threwStep.add("prints", prints);
            steps.add(threwStep);
        }

        this.previousEvent = event;
        this.previousSnapshot = snapshotThrew.snapshot;
    }

    private String inputHook() {
        return this.input;
    }

    private void printHook(String text) {
        this.printCache.add(text);
    }

    private void lockHook(String cause) throws TracerStopException {
        throw new TracerStopException("program requires input or slow function call");
    }

    /**
     * TracerStopExceptions are used to stop executing the debugee application, indicating some internal stop condition.
     * (not application fail)
     */
    static class TracerStopException extends Exception {
        TracerStopException(String message) {
            super(message);
        }
    }

    /**
     * ApplicationExternalExceptions represent application exceptions not catchable in the default tracing process.
     * (ex.: empty file -> detected in compilation, no main method found -> sent as error in standard error stream)
     */
    static class ApplicationExternalException extends Exception {
        ApplicationExternalException(String message) {
            super(message);
        }
    }
}
