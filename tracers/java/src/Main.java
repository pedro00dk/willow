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
                .help("Run the test code");

        Namespace options;
        try {
            options = argumentParser.parseArgs(args);
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException children except HelpScreens
            return;
        }

        var scan = new Scanner(System.in);
        var rawRequest = new Gson().fromJson(scan.nextLine(), JsonObject.class);
        scan.close();
        var rawSource = rawRequest.get("source");
        var rawInput = rawRequest.get("input");
        var rawSteps = rawRequest.get("steps");
        var request = new JsonObject();
        request.addProperty(
                "source",
                !options.getBoolean("test") && rawSource != null ? rawSource.getAsString()
                        : options.getBoolean("test") ? Files.readString(Path.of("./res/Main.java"))
                        : ""
        );
        request.addProperty("input", rawInput != null ? rawInput.getAsString() : "");
        request.addProperty("steps", rawSteps != null ? rawSteps.getAsNumber().intValue() : Integer.MAX_VALUE);

        var response = new Tracer(request).run();

        System.out.println(
                options.getBoolean("pretty")
                        ? new GsonBuilder().setPrettyPrinting().create().toJson(response)
                        : response.toString()
        );
    }
}
