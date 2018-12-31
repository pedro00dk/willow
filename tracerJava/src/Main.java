import core.TracerBroker;
import message.ResultMessage;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Main {

    public static void main(String[] args) throws IOException {
        var arguments = parseArgs(args);

        var tracerBroker = new TracerBroker((String) arguments.get("name"), (String) arguments.get("code"));
        if ((Boolean) arguments.get("uncontrolled")) {
            runUncontrolled(tracerBroker, (Boolean) arguments.get("formatted"), (Boolean) arguments.get("omitHelp"));
        } else {
            runControlled(tracerBroker, (Boolean) arguments.get("formatted"), (Boolean) arguments.get("omitHelp"));
        }
    }

    static Map<String, Object> parseArgs(String[] args) {
        var argsList = Stream.of(args).collect(Collectors.toList());
        var map = new HashMap<String, Object>();
        map.put("sandbox", argsList.remove("--sandbox"));
        map.put("formatted", argsList.remove("--formatted"));
        map.put("uncontrolled", argsList.remove("--uncontrolled"));
        map.put("omitHelp", argsList.contains("--omit-help"));
        var nameIndex = argsList.indexOf("--name");
        if (nameIndex == -1) {
            map.put("name", "Main");
        } else {
            map.put("name", argsList.get(nameIndex + 1));
            argsList.remove("--name");
            argsList.remove(map.get("name"));
        }
        if (argsList.size() != 1) {
            System.out.println(argsList.size());
            System.out.println(argsList);
            throw new IllegalArgumentException("wrong arguments");
        }
        map.put("code", argsList.remove(0));
        return map;
    }

    static void runUncontrolled(TracerBroker tracerBroker, boolean formatted, boolean omitHelp) {
        if (!omitHelp) {
            System.out.println("## Running in uncontrolled mode");
            System.out.println("## Output format: <event result>\\n<event value>");
            System.out.println();
        }
        printResults(tracerBroker.start(), formatted);
        // TODO implement step loop
    }

    static void runControlled(TracerBroker tracerBroker, boolean formatted, boolean omitHelp) {
        if (!omitHelp) {
            System.out.println("## Running in controlled mode");
            System.out.println("## Output format: <event result>\\n<event value>");
            System.out.println("## actions:");
            System.out.println("## start -> start the tracer");
            System.out.println("## step -> run next step");
            System.out.println("## eval <expr> -> evaluates an expression (expr shall not have spaces)");
            System.out.println("## input <data> -> sends input to script");
            System.out.println("## stop -> stops the tracer and the application");
            System.out.println();
        }

        var scanner = new Scanner(System.in);
        while (true) {
            var actionData = scanner.nextLine();
            var spaceIndex = actionData.indexOf(' ');
            var action = spaceIndex != -1 ? actionData.substring(0, spaceIndex) : actionData;
            var value = spaceIndex != -1 ? actionData.substring(spaceIndex + 1) : "";

            try {
                if (action.equals("start")) printResults(tracerBroker.start(), formatted);
                else if (action.equals("stop")) {
                    tracerBroker.stop();
                    break;
                } else { // TODO implement all actions
                    System.out.println("action not found");
                }
            } catch (Exception e) {
                System.out.println("exception:");
                System.out.println(e.getMessage());
            }
        }
    }

    static void printResults(List<ResultMessage> resultMessages, boolean formatted) {
        resultMessages.forEach(r -> {
            System.out.println(r.getResult().name().toLowerCase());
            System.out.println(r.getValue()); // TODO implement formatted print
            System.out.println();
        });
    }
}