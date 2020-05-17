import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.helper.HelpScreenException;
import net.sourceforge.argparse4j.impl.action.StoreTrueArgumentAction;
import net.sourceforge.argparse4j.inf.ArgumentParserException;
import net.sourceforge.argparse4j.inf.Namespace;
import spark.Route;
import spark.Spark;
import tracer.Tracer;


public class Main implements HttpFunction {

    public static void main(String[] args) throws ArgumentParserException, IOException {
        var options = cli(args);
        if (options == null) return;
        if (options.getBoolean("server")) server(options);
        else terminal(options);
    }

    public static Namespace cli(String[] args) throws ArgumentParserException {
        var argumentParser = ArgumentParsers.newFor("tracer").build().description("Java tracer CLI");
        argumentParser
            .usage(
                "\n\ttracer [options]\n\t" +
                    "stdin: {\"source?\": \"string\", \"input\"?: \"string\", \"steps?\": \"number\"}"
            );
        argumentParser
            .addArgument("--server")
            .setDefault(false)
            .action(new StoreTrueArgumentAction())
            .help("Enable http server mode");
        argumentParser.addArgument("--port").setDefault(8000).type(Integer.class).help("The server port");
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
        try {
            return argumentParser.parseArgs(args);
        } catch (HelpScreenException e) {
            // throws all ArgumentParserException children except HelpScreens
            return null;
        }
    }

    public static void server(Namespace options) {
        Spark.port(options.getInt("port"));
        var result = new String[]{""};
        Route route = (req, res) -> {
            service(
                req.requestMethod().toUpperCase(),
                req
                    .queryParams()
                    .stream()
                    .collect(Collectors.toMap(param -> param, param -> List.of(req.queryParams(param)))),
                req.body(),
                entry -> res.header(entry.getKey(), entry.getValue()),
                status -> res.status(status),
                content -> result[0] = content
            );
            return result[0];
        };
        Spark.get("/", route);
        Spark.post("/", route);
        Spark.options("/", route);
        System.out.println(" * Serving Spark app \"Java Tracer\"");
        System.out.println(" * Running on http://0.0.0.0:" + options.getInt("port") + " (Press CTRL+C to quit)");
    }

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        service(
            request.getMethod().toUpperCase(),
            request.getQueryParameters(),
            request.getReader().lines().collect(Collectors.joining("\n")),
            entry -> response.appendHeader(entry.getKey(), entry.getValue()),
            status -> response.setStatusCode(status),
            content -> {
                try {
                    response.getWriter().append(content).close();
                } catch (IOException e) {
                    response.setStatusCode(500);
                }
            }
        );
    }

    public static void service(
        String method,
        Map<String, List<String>> params,
        String body,
        Consumer<Map.Entry<String, String>> setHeader,
        Consumer<Integer> setStatus,
        Consumer<String> setContent
    ) {
        try {
            setHeader.accept(Map.entry("Access-Control-Allow-Origin", "*"));
            setHeader.accept(Map.entry("Access-Control-Allow-Methods", "POST"));
            setHeader.accept(Map.entry("Access-Control-Allow-Headers", "Content-Type"));
            setHeader.accept(Map.entry("Access-Control-Max-Age", "3600"));
            setHeader.accept(Map.entry("Content-Type", "application/json"));
            if (method.equals("OPTIONS")) {
                setStatus.accept(204);
                setContent.accept("");
                return;
            } else if (!method.equals("POST")) {
                setStatus.accept(405);
                setContent.accept("not allowed");
                return;
            }
            var test = params.getOrDefault("test", List.of()).contains("true");
            var pretty = params.getOrDefault("pretty", List.of()).contains("true");
            JsonObject requestBody = null;
            try {
                requestBody = new Gson().fromJson(body, JsonObject.class);
            } catch (Exception e) {
                System.out.println(e);
                setStatus.accept(405);
                setContent.accept("empty body");
                return;
            }
            var responseBody = trace(requestBody, test, pretty);
            setStatus.accept(200);
            setContent.accept(responseBody);
        } catch (Exception e) {
            setStatus.accept(500);
            setContent.accept(e.toString() + "\n" + e.getMessage());
        }
    }

    public static void terminal(Namespace options) throws IOException {
        var scan = new Scanner(System.in);
        var request = new Gson().fromJson(scan.nextLine(), JsonObject.class);
        scan.close();
        var response = trace(request, options.getBoolean("test"), options.getBoolean("pretty"));
        System.out.println(response);
    }

    public static String trace(JsonObject request, boolean test, boolean pretty) throws IOException {
        var source = request.get("source");
        var input = request.get("input");
        var steps = request.get("steps");
        var tracerRequest = new JsonObject();
        var testFile = test
            ? new BufferedReader(new InputStreamReader(Main.class.getResourceAsStream("Test.java"))).lines().collect(Collectors.joining("\n")) : "";
        tracerRequest.addProperty("source", !test && source != null ? source.getAsString() : test ? testFile : "");
        tracerRequest.addProperty("input", input != null ? input.getAsString() : "");
        tracerRequest.addProperty("steps", steps != null ? Math.min(Math.max(0, steps.getAsInt()), 10000) : 5000);
        var tracerResponse = new Tracer(tracerRequest).run();
        var builder = new GsonBuilder();
        if (pretty) builder.setPrettyPrinting();
        var stringResponse = builder.create().toJson(tracerResponse);
        return stringResponse;

    }
}
