import com.sun.jdi.ThreadReference;
import com.sun.jdi.VMDisconnectedException;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.VMStartException;
import com.sun.jdi.event.Event;
import com.sun.jdi.event.ThreadStartEvent;
import com.sun.jdi.event.VMDisconnectEvent;
import com.sun.jdi.request.EventRequest;
import com.sun.jdi.request.StepRequest;
import com.sun.tools.jdi.VirtualMachineManagerImpl;

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
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Executes source code.
 */
class Executor {

    /**
     * Executes the source code in debug mode, allowing interception of the debugee program through hook functions.
     *
     * @param source    source code
     * @param trace     consumer called for each produced event.
     * @param inputHook supplier that provides input to the debugee program, called only once.
     * @param printHook consumer called after frames that produce some output in the standard streams.
     * @param lockHook  consumer called if the debugee VM takes more than 1 second to produce an event (stops the Executor).
     * @throws IOException
     * @throws IllegalConnectorArgumentsException
     * @throws VMStartException
     * @throws ApplicationExternalException
     */
    void execute(String source, LambdaUtils.ConsumerT<Event> trace, Supplier<String> inputHook, LambdaUtils.ConsumerT<String> printHook, LambdaUtils.ConsumerT<String> lockHook) throws Exception {
        var filename = getFilename(source);
        var path = generateProject(source, filename);
        compileProject(path, filename);
        var vm = launchVirtualMachine(path, filename);
        var allowedThreads = configureEventRequests(vm, path);
        var stdin = vm.process().getOutputStream();
        var stdout = vm.process().getInputStream();
        var stderr = vm.process().getErrorStream();
        stdin.write(inputHook.get().getBytes());
        stdin.flush();
        stdin.close();
        try {
            outerLoop:
            while (true) {
                vm.resume();
                var eventSet = vm.eventQueue().remove(1000);
                if (eventSet == null) {
                    lockHook.accept(null);
                    break;
                }
                for (var event : eventSet) {
                    if (event instanceof ThreadStartEvent && !allowedThreads.contains(((ThreadStartEvent) event).thread().name())) {
                        ((ThreadStartEvent) event).thread().interrupt();
                        continue;
                    }
                    var printAvailable = stdout.available();
                    var errorAvailable = stderr.available();
                    if (printAvailable > 0) printHook.accept(new String(stdout.readNBytes(printAvailable)));
                    if (errorAvailable > 0) printHook.accept(new String(stderr.readNBytes(errorAvailable)));
                    trace.accept(event);
                    if (event instanceof VMDisconnectEvent) break outerLoop;
                }
            }
        } catch (RuntimeException e) {
            throw e.getCause() == null ? e : ((Exception) e.getCause());
        } finally {
            try {
                vm.exit(0);
            } catch (VMDisconnectedException e) {
                // throws this exceptions if the vm is already disconnected
            }
        }
    }

    /**
     * Generate a filename for the source based on its contents.
     * The filename is the name of the class that contains the main method. If not found, Main.java is returned.
     *
     * @param source source code string
     * @return source code filename
     */
    private String getFilename(String source) {
        var commentStringRegex = Pattern
                .compile("(/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+/|[\\t]*//.*)|\"(\\\\.|[^\\\\\"])*\"|'(\\\\[\\s\\S]|[^'])*'");
        var stripedCode = commentStringRegex.matcher(source).replaceAll("");

        var classRegex = Pattern.compile("(public\\s+class\\s+([A-Za-z][A-Za-z0-9_]*))");
        var classMatcher = classRegex.matcher(stripedCode);

        var classesIndicesNames = Stream.generate(classMatcher::find)
                .takeWhile(found -> found)
                .map(found -> Map.entry(classMatcher.start(), classMatcher.group(2)))
                .collect(Collectors.toList());

        var mainMethodRegex = Pattern.compile("(public\\s+static\\s+void\\s+main\\s*\\(.*\\))");
        var mainMethodMatcher = mainMethodRegex.matcher(stripedCode);
        var mainMethodIndices = Stream.generate(mainMethodMatcher::find)
                .takeWhile(found -> found)
                .map(f -> mainMethodMatcher.start())
                .collect(Collectors.toList());

        if (classesIndicesNames.isEmpty() || mainMethodIndices.isEmpty()) return "Main.java";

        var mainIndex = mainMethodIndices.get(0);
        var classesBeforeMain = classesIndicesNames
                .stream()
                .filter(classIndexName -> classIndexName.getKey() < mainIndex)
                .collect(Collectors.toList());
        if (!classesBeforeMain.isEmpty()) return classesBeforeMain.get(0).getValue() + ".java";
        else return classesIndicesNames.get(0).getValue() + ".java";

    }

    /**
     * Generate directories and a source file containing the source code to be executed in a system tmp directory.
     *
     * @param source   source code string
     * @param filename source code filename
     * @return the generated directory path
     * @throws IOException
     * @throws ApplicationExternalException
     */
    private Path generateProject(String source, String filename) throws IOException, ApplicationExternalException {
        var path = Files.createTempDirectory("");
        if (source.isBlank()) // javac does not fail with empty files, but produces no output
            throw new ApplicationExternalException("Compilation fail:\nUnable to create class from empty file.\n");
        var srcPath = Paths.get(path.toString(), "src/");
        Files.createDirectory(srcPath);
        var mainPath = Paths.get(srcPath.toString(), filename);
        Files.writeString(mainPath, source);
        return path;
    }

    /**
     * Compile the received project, generating a bin/ folder inside the project's directory.
     *
     * @param path     path to the project
     * @param filename source code filename
     * @throws IOException
     * @throws ApplicationExternalException
     */
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

    /**
     * Create a virtual machine that runs the project in debug mode.
     *
     * @param path     project path
     * @param filename source code filename
     * @return the virtual machine
     * @throws IllegalConnectorArgumentsException
     * @throws IOException
     * @throws VMStartException
     */
    private VirtualMachine launchVirtualMachine(Path path, String filename) throws IllegalConnectorArgumentsException, IOException, VMStartException {
        var binPath = Paths.get(path.toString(), "bin/");
        var vmm = VirtualMachineManagerImpl.virtualMachineManager();
        var connector = vmm.defaultConnector();
        var connectorArguments = connector.defaultArguments();
        connectorArguments.get("suspend").setValue("true");
        connectorArguments.get("options").setValue("-cp \"" + binPath.toAbsolutePath().toString() + "\"");
        connectorArguments.get("main").setValue(filename.substring(0, filename.indexOf('.')));
        return connector.launch(connectorArguments);
    }

    /**
     * Configure a virtual machine to produce events only from the main thread of user classes.
     *
     * @param vm   the virtual machine
     * @param path project path
     * @return thread names that must be alive during the program execution, other threads can be killed
     */
    private Set<String> configureEventRequests(VirtualMachine vm, Path path) {
        var defaultThreads = List.copyOf(vm.allThreads());
        var mainThread = defaultThreads
                .stream()
                .filter(t -> t.name().equals("main"))
                .findFirst()
                .orElseThrow(() -> new NullPointerException("main thread not found"));
        var allowedThreadsNames = defaultThreads
                .stream()
                .map(ThreadReference::name)
                .collect(Collectors.toCollection(HashSet::new));
        allowedThreadsNames.addAll(Set.of("Common-Cleaner", "DestroyJavaVM"));

        var vmDeathRequest = vm.eventRequestManager().createVMDeathRequest();
        var threadStartRequest = vm.eventRequestManager().createThreadStartRequest();
        threadStartRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        var threadDeathRequest = vm.eventRequestManager().createThreadDeathRequest();
        threadDeathRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);

        var classNames = getUserClasses(path);

        var methodEntryRequests = classNames
                .stream()
                .map(className -> {
                    var methodEntryRequest = vm.eventRequestManager().createMethodEntryRequest();
                    methodEntryRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    methodEntryRequest.addThreadFilter(mainThread);
                    methodEntryRequest.addClassFilter(className);
                    return methodEntryRequest;
                })
                .collect(Collectors.toList());

        var methodExitRequests = classNames
                .stream()
                .map(className -> {
                    var methodExitRequest = vm.eventRequestManager().createMethodExitRequest();
                    methodExitRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    methodExitRequest.addThreadFilter(mainThread);
                    methodExitRequest.addClassFilter(className);
                    return methodExitRequest;
                })
                .collect(Collectors.toList());

        var stepRequests = classNames
                .stream()
                .map(className -> {
                    var stepRequest = vm
                            .eventRequestManager()
                            .createStepRequest(mainThread, StepRequest.STEP_LINE, StepRequest.STEP_INTO);
                    stepRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    stepRequest.addClassFilter(className);
                    return stepRequest;
                })
                .collect(Collectors.toList());

        var exceptionRequests = classNames
                .stream()
                .map(className -> {
                    var exceptionRequest = vm.eventRequestManager().createExceptionRequest(null, true, true);
                    exceptionRequest.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    exceptionRequest.addClassFilter(className);
                    return exceptionRequest;
                })
                .collect(Collectors.toList());

        vmDeathRequest.enable();
        threadStartRequest.enable();
        threadDeathRequest.enable();
        methodEntryRequests.forEach(EventRequest::enable);
        methodExitRequests.forEach(EventRequest::enable);
        stepRequests.forEach(EventRequest::enable);
        exceptionRequests.forEach(EventRequest::enable);

        return allowedThreadsNames;
    }

    /**
     * Return the list of classes create by the user (.class files).
     *
     * @param path project path
     * @return user declared classes
     */
    private List<String> getUserClasses(Path path) {
        var binPath = Paths.get(path.toString(), "bin/");
        try {
            return Files
                    .list(binPath)
                    .map(p -> p.getFileName().toString())
                    .map(s -> s.substring(0, s.lastIndexOf('.')))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }

    /**
     * Exception used to represent errors not catchable in the default tracing process.
     * (ex.: empty file -> detected in compilation, no main method found -> sent as error in standard error stream)
     */
    static class ApplicationExternalException extends Exception {
        ApplicationExternalException(String message) {
            super(message);
        }
    }

    static class LambdaUtils {

        static <T, U> Function<T, U> asFunction(FunctionT<T, U> functionT) {
            return (T argument) -> {
                try {
                    return functionT.apply(argument);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            };
        }

        static <T> Consumer<T> asConsumer(ConsumerT<T> consumerT) {
            return (T argument) -> {
                try {
                    consumerT.accept(argument);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            };
        }

        @FunctionalInterface
        interface FunctionT<T, U> {
            U apply(T argument) throws Exception;
        }

        @FunctionalInterface
        interface ConsumerT<T> {
            void accept(T argument) throws Exception;
        }
    }
}
