package app;

import core.tracer.Tracer;

public class App {

    public static void main(String[] args) throws Exception {
        new Tracer(
                "Hello.java",
                "public class Hello{public static void main(String[] args){System.out.println(\"from hello\");}}"
        ).run();
    }
}