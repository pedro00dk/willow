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
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * Traces a java file and analyses its state after each instruction.
 */
public class Tracer {
    private String filename;
    private String source;
    private String input;
    private int steps;

    public Tracer(protobuf.Tracer.Trace trace) {
        this.filename = getMainFilename(trace.getSource());
        this.source = trace.getSource();
        this.input = trace.getInput();
        this.steps = trace.getSteps();
    }

    private String getMainFilename(String code) {
        var commentStringRegex = Pattern.compile("(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/|[\\t]*//.*)|\"(\\\\.|[^\\\\\"])*\"|'(\\\\[\\s\\S]|[^'])*'");
        code = commentStringRegex.matcher(code).replaceAll("");

        var classRegex = Pattern.compile("(public\\s+class\\s+([A-Za-z][A-Za-z0-9_]*))");
        var classMatcher = classRegex.matcher(code);
        var classesIndicesNames = IntStream.generate(() -> 0)
                .takeWhile(i -> classMatcher.find())
                .mapToObj(i -> Map.entry(classMatcher.start(), classMatcher.group(2)))
                .collect(Collectors.toList());

        var mainMethodRegex = Pattern.compile("(public\\s+static\\s+void\\s+main\\s*\\(.*\\))");
        var mainMethodMatcher = mainMethodRegex.matcher(code);
        var mainMethodIndices = IntStream.generate(() -> 0)
                .takeWhile(i -> mainMethodMatcher.find())
                .map(i -> mainMethodMatcher.start())
                .boxed()
                .collect(Collectors.toList());

        if (classesIndicesNames.isEmpty()) return "Main.java";
        else if (mainMethodIndices.isEmpty()) return classesIndicesNames.get(0).getValue() + ".java";
        else {
            var mainIndex = mainMethodIndices.get(0);
            var classesBeforeMain = classesIndicesNames.stream()
                    .filter(classIndexName -> classIndexName.getKey() < mainIndex)
                    .collect(Collectors.toList());
            if (!classesBeforeMain.isEmpty()) return classesBeforeMain.get(0).getValue() + ".java";
            else return classesIndicesNames.get(0).getValue() + ".java";
        }
    }

    private Path generateProject(String filename, String source) throws Exception {
        var path = Files.createTempDirectory("");
        if (source.isBlank())
            throw new Exception("Compilation fail:\nUnable to create class from empty file.\n");
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
        if (!task.call())
            throw new Exception(
                    "Compilation fail:\n" + output.toString() +
                            dgCollector.getDiagnostics().stream()
                                    .map(Diagnostic::toString)
                                    .collect(Collectors.joining("\n", "\n", "\n"))
            );
    }

    public protobuf.Tracer.Result run() {
        // compilation
        Path path;
        try {
            path = generateProject(filename, source);
            compileProject(path, filename);
        } catch (Exception e) {
            var resultBuilder = protobuf.Tracer.Result.newBuilder();
            resultBuilder.addStepsBuilder().getThrewBuilder().setException(Util.dump(e, Set.of(-1, -2, -3, -4)));
            return resultBuilder.build();
        }
        TraceProcessor traceProcessor = new TraceProcessor(input, steps);
        try {
            new Executor(path, filename, traceProcessor).execute();
            return traceProcessor.getResultBuilder().build();
        } catch (RuntimeException e) {
            // pos compilation error
            var resultBuilder = traceProcessor.getResultBuilder();
            var stepBuilder = resultBuilder.addStepsBuilder();
            stepBuilder.getThrewBuilder().setException(Util.dump(e.getCause(), Set.of(-1, -2, -3, -4)));
            stepBuilder.addAllPrints(traceProcessor.getPrintCache());
            return resultBuilder.build();
        } catch (Exception e) {
            // inspection error
            var resultBuilder = traceProcessor.getResultBuilder();
            var stepBuilder = resultBuilder.addStepsBuilder();
            stepBuilder.getThrewBuilder().setException(Util.dump(e));
            stepBuilder.addAllPrints(traceProcessor.getPrintCache());
            return resultBuilder.build();
        }
    }
}