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
        var parser = ArgumentParsers.newFor("tracer").build().description("Java tracer CLI");
        parser
                .usage(
                        "tracer [options]\ninput pipe: {\"source?\": \"string\", \"input\"?: \"string\", \"steps?\": \"number\"}"
                );
        parser
                .addArgument("--pretty")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Pretty print output");
        parser
                .addArgument("--test")
                .setDefault(false)
                .action(new StoreTrueArgumentAction())
                .help("Run the test code ignoring the provided");

        Namespace arguments;
        try {
            arguments = parser.parseArgs(args);
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException except HelpScreens
            return;
        }

        var scan = new Scanner(System.in);
        var trace = new Gson().fromJson(scan.nextLine(), JsonObject.class);
        scan.close();

        var source = trace.get("source");
        var sourceValue = !arguments.getBoolean("test") && source != null ? source.getAsString()
                : arguments.getBoolean("test") ? Files.readString(Path.of("./res/Main.java"))
                : "";
        trace.addProperty("source", sourceValue);

        var input = trace.get("input");
        var inputValue = input != null ? input.getAsString() : "";
        trace.addProperty("input", inputValue);

        var steps = trace.get("steps");
        var stepsValue = steps != null ? steps.getAsNumber().intValue() : Integer.MAX_VALUE;
        trace.addProperty("steps", stepsValue);

        var t = new Tracer(trace);
        var result = t.run();

        if (!arguments.getBoolean("pretty")) System.out.println(result.toString());
        else System.out.println(new GsonBuilder().setPrettyPrinting().create().toJson(result));
    }
}
