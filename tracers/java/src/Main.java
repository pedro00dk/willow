import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;
import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import tracer.Tracer;


public class Main implements HttpFunction {

    @Override
    public void service(HttpRequest request, HttpResponse response) throws Exception {
        response.appendHeader("Access-Control-Allow-Origin", "*");
        response.appendHeader("Access-Control-Allow-Methods", "POST");
        response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
        response.appendHeader("Access-Control-Max-Age", "3600");
        response.appendHeader("Content-Type", "application/json");
        var method = request.getMethod().toUpperCase();
        if (method.equals("OPTIONS")) {
            response.setStatusCode(204);
            response.getWriter().append("").close();
            return;
        } else if (!method.equals("POST")) {
            response.setStatusCode(405);
            response.getWriter().append("not allowed").close();
            return;
        }
        var body = request.getReader().lines().collect(Collectors.joining("\n"));
        JsonObject requestBody = null;
        try {
            requestBody = new Gson().fromJson(body, JsonObject.class);
        } catch (Exception e) {
            response.setStatusCode(400);
            response.getWriter().append("empty body").close();
            return;
        }
        var responseBody = trace(requestBody, false);
        response.setStatusCode(200);
        response.getWriter().append(responseBody).close();
    }

    public static String trace(JsonObject request, boolean pretty) {
        var source = request.get("source");
        var input = request.get("input");
        var steps = request.get("steps");
        var tracerRequest = new JsonObject();
        tracerRequest.addProperty("source", source != null ? source.getAsString() : "");
        tracerRequest.addProperty("input", input != null ? input.getAsString() : "");
        tracerRequest.addProperty("steps", steps != null ? Math.min(Math.max(0, steps.getAsInt()), 10000) : 5000);
        var tracerResponse = new Tracer(tracerRequest).run();
        var builder = new GsonBuilder();
        if (pretty) builder.setPrettyPrinting();
        var stringResponse = builder.create().toJson(tracerResponse);
        return stringResponse;
    }

    public static void test() {
        var source = new BufferedReader(new InputStreamReader(Main.class.getResourceAsStream("Test.java")))
            .lines()
            .collect(Collectors.joining("\n"));
        var input = new BufferedReader(new InputStreamReader(Main.class.getResourceAsStream("Input.txt")))
            .lines()
            .collect(Collectors.joining("\n"));
        var request = new JsonObject();
        request.addProperty("source", source);
        request.addProperty("input", input);
        request.addProperty("steps", 10000);
        System.out.println(trace(request, true));
    }

    public static void main(String[] args) {
        test();
    }
}
