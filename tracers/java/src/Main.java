import com.google.gson.Gson;
import com.google.gson.JsonArray;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.helper.HelpScreenException;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) throws ArgumentParserException, IOException {
        var parser = ArgumentParsers.newFor("tracer").build().description("Java tracer CLI");
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

        Namespace arguments = null;
        try {
            arguments = parser.parseArgs(args);
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException except HelpScreens
            return;
        }

        var inMode = arguments.getString("in_mode");
        var outMode = arguments.getString("out_mode");
        var test = arguments.getBoolean("test");

        protobuf.Tracer.Trace trace;
        if (inMode.equals("proto")) {
            trace = protobuf.Tracer.Trace.parseFrom(
                    System.in.readNBytes(
                            ByteBuffer.wrap(System.in.readNBytes(4)).order(ByteOrder.LITTLE_ENDIAN).getInt()
                    )
            );
        } else {
            System.out.println("trace => [\"source\", \"input\"?, steps?]:");
            var scan = new Scanner(System.in);
            var array = new Gson().fromJson(scan.nextLine(), JsonArray.class);
            var builder = protobuf.Tracer.Trace.newBuilder();
            builder.setSource(
                    test
                            ? Files.readString(Path.of("./res/Main.java"))
                            : array.size() > 0 ? array.get(0).getAsString() : ""
            );
            builder.setInput(array.size() > 1 ? array.get(1).getAsString() : "");
            builder.setSteps(array.size() > 2 ? array.get(2).getAsInt() : Integer.MAX_VALUE);
            trace = builder.build();
        }

        var t = new Tracer(trace);
        var result = t.run();

        if (outMode.equals("proto")) {
            var serialized = result.toByteArray();
            System.out.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(serialized.length).array());
            System.out.write(serialized);
            System.out.flush();
        } else System.out.println(result.toString());
    }


}