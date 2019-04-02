import com.google.gson.Gson;
import com.google.gson.JsonArray;
import core.Client;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.helper.HelpScreenException;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import protobuf.EventOuterClass;
import protobuf.Tracer;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Main {

    public static void main(String[] args) {
        var parser = ArgumentParsers.newFor("tracer").build().description("Java tracer CLI");
        parser.addArgument("--auto")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Run without stopping");
        parser.addArgument("--in-mode")
                .choices("proto", "text")
                .setDefault("proto")
                .help("The input mode");
        parser.addArgument("--out-mode")
                .choices("proto", "text")
                .setDefault("proto")
                .help("The output mode");
        parser.addArgument("--test")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Run the test code ignoring the provided");
        try {
            var arguments = parser.parseArgs(args);
            run(
                    arguments.getBoolean("auto"),
                    arguments.getString("in_mode"),
                    arguments.getString("out_mode"),
                    arguments.getBoolean("test")
            );
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException except HelpScreens
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1); // force thread stop if the tracer is running
        }
    }

    private static void run(boolean auto, String inMode, String outMode, boolean test) throws Exception {
        var tracer = new Client();

        Tracer.TracerRequest request;
        if (inMode.equals("proto")) {
            request = readProtoInput();
            if (!request.getActions(0).hasStart()) throw new Exception("unexpected action");
            var main = request.getActions(0).getStart().getMain();
            if (main == null || main.isBlank()) {
                main = getMainFileName(request.getActions(0).getStart().getCode());
                var requestBuilder = request.toBuilder();
                requestBuilder.getActionsBuilderList().get(0).getStartBuilder().setMain(main);
                request = requestBuilder.build();
            }
        } else {
            var input = readTextInput("start {json([\"main\", \"code\"])}:\n");
            var array = new Gson().fromJson(input, JsonArray.class);
            String main = null;
            try {
                main = array.get(0).getAsString();
            } catch (UnsupportedOperationException e) {
                // ignore null
            }
            var code = array.get(1).getAsString();
            var startActionBuilder = Tracer.Action.newBuilder();

            if (main == null || main.isBlank()) main = getMainFileName(code);

            startActionBuilder.getStartBuilder()
                    .setMain(main)
                    .setCode(code);
            request = Tracer.TracerRequest.newBuilder()
                    .addActions(startActionBuilder)
                    .build();
        }

        if (test) {
            var main = "Main.java";
            var code = Files.readString(Path.of("./res/Main.java"));
            var startActionBuilder = Tracer.Action.newBuilder();
            startActionBuilder.getStartBuilder()
                    .setMain(main)
                    .setCode(code);
            request = Tracer.TracerRequest.newBuilder()
                    .addActions(startActionBuilder)
                    .build();
        }

        var events = tracer.start(request.getActions(0));
        writeOutput(outMode, events);

        while (true) {
            if (!tracer.isTracerRunning()) break;
            if (auto) {
                var stepActionBuilder = Tracer.Action.newBuilder();
                stepActionBuilder.getStepBuilder().build();
                events = tracer.step(stepActionBuilder.build());
                writeOutput(outMode, events);
                if (events.get(events.size() - 1).hasLocked()) {
                    var inputActionBuilder = Tracer.Action.newBuilder();
                    inputActionBuilder.getInputBuilder().addAllLines(List.of("input"));
                    tracer.input(inputActionBuilder.build());
                }
            } else {
                if (inMode.equals("proto")) {
                    request = readProtoInput();
                    events = tracer.demultiplexAction(request.getActions(0));
                } else {
                    var actionData = readTextInput("action {\"stop\", \"step\", \"input\" json([\"line\"*])}:\n");
                    var splitIndex = actionData.indexOf(' ');
                    var actionString = actionData.substring(0, splitIndex != -1 ? splitIndex : actionData.length());
                    var value = actionData.substring(splitIndex + 1, splitIndex != -1 ? actionData.length() : 0);
                    var actionBuilder = Tracer.Action.newBuilder();
                    switch (actionString) {
                        case "stop":
                            actionBuilder.getStopBuilder().build();
                            break;
                        case "step":
                            actionBuilder.getStepBuilder().build();
                            break;
                        case "input":
                            actionBuilder.getInputBuilder().addAllLines(List.of(value)).build();
                            break;
                        default:
                            throw new Exception("unexpected action");
                    }
                    events = tracer.demultiplexAction(actionBuilder.build());
                }
                if (events != null) writeOutput(outMode, events);
            }
        }
    }

    private static Tracer.TracerRequest readProtoInput() throws IOException {
        return Tracer.TracerRequest.parseFrom(
                System.in.readNBytes(
                        ByteBuffer.wrap(System.in.readNBytes(4)).order(ByteOrder.LITTLE_ENDIAN).getInt()
                )
        );
    }

    private static final Scanner SCAN = new Scanner(System.in);

    private static String readTextInput(String prompt) {
        System.out.print(prompt);
        return SCAN.nextLine();
    }

    private static void writeOutput(String mode, List<EventOuterClass.Event> events) throws IOException {
        var response = Tracer.TracerResponse.newBuilder()
                .addAllEvents(events)
                .build();
        switch (mode) {
            case "proto":
                var serializedMessage = response.toByteArray();
                var size = ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(serializedMessage.length);
                System.out.write(size.array());
                System.out.write(serializedMessage);
                System.out.flush();
                break;
            case "text":
                System.out.println(response.toString());
        }
    }

    private static String getMainFileName(String code) {
        code = code != null ? code : "";
        var codeLines = code.lines().collect(Collectors.toList());
        var classRegex = Pattern.compile("^.*public\\s+class\\s+([A-Za-z][A-Za-z0-9_]*).*");
        var mainMethodRegex = Pattern.compile("^.*public\\s+static\\s+void\\s+main\\s*\\(.*");
        var mainMethodRegexPredicate = mainMethodRegex.asMatchPredicate();

        var mainMethodLine = IntStream.range(0, codeLines.size())
                .filter(index -> mainMethodRegexPredicate.test(codeLines.get(index)))
                .findFirst()
                .orElse(-1);

        var classes = IntStream.range(0, codeLines.size())
                .mapToObj(index -> Map.entry(index, classRegex.matcher(codeLines.get(index))))
                .filter(entry -> entry.getValue().matches())
                .map(entry -> Map.entry(entry.getKey(), entry.getValue().group(1)))
                .collect(Collectors.toList());

        var mainClass = classes.stream()
                .filter(entry -> entry.getKey() <= mainMethodLine)
                .reduce((first, second) -> second) // no find last
                .map(Map.Entry::getValue)
                .orElse(classes.size() > 0 ? classes.get(0).getValue() : "");

        return mainClass.isEmpty() ? "" : mainClass + ".java";
    }
}