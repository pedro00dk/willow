import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.helper.HelpScreenException;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws ArgumentParserException, IOException {
        var argumentParser = ArgumentParsers.newFor("tracer").build().description("Java tracer CLI");
        argumentParser.usage("tracer [options]\n  stdin: {\"source?\": \"string\", \"input\"?: \"string\", \"steps?\": \"number\"}");
        argumentParser
                .addArgument("--pretty")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Pretty print output");
        argumentParser
                .addArgument("--test")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Run the test code ignoring the provided");

        Namespace options;
        try {
            options = argumentParser.parseArgs(args);
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException children except HelpScreens
            return;
        }

        var scan = new Scanner(System.in);
        var traceData = new Gson().fromJson(scan.nextLine(), JsonObject.class);
        scan.close();
        var sourceJson = traceData.get("source");
        var inputJson = traceData.get("input");
        var stepsJson = traceData.get("steps");
        var trace = new JsonObject();
        trace.addProperty(
                "source",
                !options.getBoolean("test") && sourceJson != null ? sourceJson.getAsString()
                        : options.getBoolean("test") ? Files.readString(Path.of("./res/Main.java"))
                        : ""
        );
        trace.addProperty("input", inputJson != null ? inputJson.getAsString() : "");
        trace.addProperty("steps", stepsJson != null ? stepsJson.getAsNumber().intValue() : Integer.MAX_VALUE);

        var result = new Tracer(trace).run();

        System.out.println(
                options.getBoolean("pretty")
                        ? new GsonBuilder().setPrettyPrinting().create().toJson(result)
                        : result.toString()
        );
    }
}
