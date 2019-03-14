import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.protobuf.TextFormat;
import core.Client;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.helper.HelpScreenException;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import protobuf.EventOuterClass;
import protobuf.Tracer;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws Exception {
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
        }
    }

    private static void run(boolean auto, String inMode, String outMode, boolean test) throws Exception {
        var tracer = new Client();

        Tracer.TracerRequest request;
        if (inMode.equals("proto")) {
            request = readProtoInput();
            if (!request.getActions(0).hasStart()) throw new Exception("unexpected action");
        } else {
            var input = readTextInput("start {json([\"main\", \"code\"])}:\n");
            var array = new Gson().fromJson(input, JsonArray.class);
            var main = array.get(0).getAsString();
            var code = array.get(1).getAsString();
            var startActionBuilder = Tracer.Action.newBuilder();
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
                    tracer.demultiplexAction(request.getActions(0));
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
                    if (events != null) writeOutput(outMode, events);
                }
            }
        }
    }

    private static Tracer.TracerRequest readProtoInput() throws IOException {
        return Tracer.TracerRequest.parseFrom(
                System.in.readNBytes(ByteBuffer.wrap(System.in.readNBytes(4)).getInt())
        );
    }

    private static final Scanner SCAN = new Scanner(System.in);

    private static String readTextInput(String prompt) {
        System.out.print(prompt);
        return SCAN.nextLine();
    }

    private static final Gson SERIALIZER = new GsonBuilder().serializeNulls().create();

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
                System.out.println(TextFormat.printToString(response));
        }
    }
//
//    private static void runUncontrolled(Client client) throws InterruptedException {
//        printResults(client.start());
//        if (!client.isTracerRunning()) return;
//        while (true) {
//            var results = client.step();
//            printResults(results);
//            if (results.get(results.size() - 1).getName() == ResultMessage.Result.locked) client.input("");
//            System.out.println(client.isTracerRunning());
//            if (!client.isTracerRunning()) break;
//        }
//    }
//
//    private static void runControlled(Client client) {
//        var scanner = new Scanner(System.in);
//        while (true) {
//            var actionData = scanner.nextLine();
//            var spaceIndex = actionData.indexOf(' ');
//            var action = spaceIndex != -1 ? actionData.substring(0, spaceIndex) : actionData;
//            var value = spaceIndex != -1 ? actionData.substring(spaceIndex + 1) : "";
//            try {
//                if (action.equals(ActionMessage.Action.start.name())) printResults(client.start());
//                else if (action.equals(ActionMessage.Action.stop.name())) {
//                    try {
//                        client.stop();
//                    } catch (Exception e) { // ignore
//                    }
//                    break;
//                } else if (action.equals(ActionMessage.Action.input.name())) client.input(value);
//                else if (action.equals(ActionMessage.Action.step.name())) printResults(client.step());
//                else {
//                    throw new Exception("action not found");
//                }
//                if (!client.isTracerRunning()) break;
//            } catch (Exception e) {
//                printError(e.getMessage());
//            }
//        }
//    }
}