import core.Tracer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

    public static void main(String[] args) throws IOException {
        var code = Files.readString(Path.of("res", "Test.java"));
        new Tracer("Test.java", code).run();
    }
}