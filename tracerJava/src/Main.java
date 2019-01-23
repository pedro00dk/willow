import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import core.TracerBroker;
import message.ResultMessage;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws InterruptedException, IOException {
        var parser = ArgumentParsers.newFor("tracer").build().description("Tracer CLI parser");
        parser.addArgument("code").nargs("?").help("The python code to parse");
        parser.addArgument("--name").setDefault("Main.java").help("The code name");
        parser.addArgument("--test").setDefault(false).action(new StoreTrueArgumentAction())
                .help("Run the test code, ignore any provided");
        parser.addArgument("--uncontrolled").setDefault(false).action(new StoreTrueArgumentAction())
                .help("Run without stopping");
        parser.addArgument("--sandbox").setDefault(false).action(new StoreTrueArgumentAction())
                .help("Run in a restricted scope");


        Namespace arguments;
        try {
            arguments = parser.parseArgs(args);
        } catch (ArgumentParserException e) {
            return;
        }

        var code = arguments.getBoolean("test") ? Files.readString(Path.of("./res/Main.java")) : null;
        code = !arguments.getBoolean("test") ? arguments.getString("code") : code;

        if (code == null) {
            printError("No code or test flag provided. check --help");
            System.exit(1);
        }

        var tracerBroker = new TracerBroker(arguments.getBoolean("test") ? "Main.java" : arguments.get("name"), code);
        printResults(List.of());
        if (arguments.getBoolean("uncontrolled")) runUncontrolled(tracerBroker);
        else runControlled(tracerBroker);
    }

    private static void runUncontrolled(TracerBroker tracerBroker) throws InterruptedException {
        printResults(tracerBroker.start());
        if (!tracerBroker.isTracerRunning()) return;
        while (true) {
            var results = tracerBroker.step();
            printResults(results);
            if (results.get(results.size() - 1).getName() == ResultMessage.Result.locked) tracerBroker.input("");
            System.out.println(tracerBroker.isTracerRunning());
            if (!tracerBroker.isTracerRunning()) break;
        }
    }

    private static void runControlled(TracerBroker tracerBroker) {
        var scanner = new Scanner(System.in);
        while (true) {
            var actionData = scanner.nextLine();
            var spaceIndex = actionData.indexOf(' ');
            var action = spaceIndex != -1 ? actionData.substring(0, spaceIndex) : actionData;
            var value = spaceIndex != -1 ? actionData.substring(spaceIndex + 1) : "";
            try {
                if (action.equals("start")) printResults(tracerBroker.start());
                else if (action.equals("step")) printResults(tracerBroker.step());
                else if (action.equals("input")) tracerBroker.input(value);
                else if (action.equals("stop")) {
                    try {
                        tracerBroker.stop();
                    } catch (Exception e) { // ignore
                    }
                    break;
                } else {
                    throw new Exception("action not found");
                }
                if (!tracerBroker.isTracerRunning()) break;
            } catch (Exception e) {
                printError(e.getMessage());
            }
        }
    }

    private static final Gson SERIALIZER = new GsonBuilder().serializeNulls().create();

    private static void printResults(List<ResultMessage> resultMessages) {
        System.out.println(SERIALIZER.toJson(resultMessages));
    }

    private static void printError(String error) {
        System.err.println("error: " + error);
    }
}