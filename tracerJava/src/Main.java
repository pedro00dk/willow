import core.Tracer;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Main {

    public static void main(String[] args) throws IOException {
        var parsedArgs = parseArgs(args);
        new Tracer((String) parsedArgs.get("name"), (String) parsedArgs.get("code")).run();
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
}