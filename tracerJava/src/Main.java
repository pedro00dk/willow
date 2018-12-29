import core.Tracer;

public class Main {

    public static void main(String[] args) {
        new Tracer(
                "Hello.java",
                "import java.util.*;\n" +
                        "" +
                        "public class Hello {\n" +
                        "    public static void main(String[] args) {\n" +
                        "        System.out.println(\"from hello\");\n" +
                        "        Class ccc = String.class;\n" +
                        "        Thread ttt = Thread.currentThread();\n" +
                        "        String k = null;\n" +
                        "        String l = \"some string\";\n" +
                        "        var x = 0;\n" +
                        "        var y = -123l;\n" +
                        "        var a = new int[]{1,2,3,4};\n" +
                        "        var b = new String[]{\"a\",\"b\", \"c\", \"d\"};\n" +
                        "        var c = new HashSet<String>();\n" +
                        "        var d = new HashMap<Integer, String>();\n" +
                        "        //var scan = new Scanner(System.in);\n" +
                        "        //var input = scan.nextLine();\n" +
                        "        //System.out.println(input);\n" +
                        "        anotherMethodForTesting();\n" +
                        "    }\n" +
                        "\n"+
                        "    public static void anotherMethodForTesting() {\n"+
                        "        double v = 123.0;\n"+
                        "        int vi = (int) v;\n"+
                        "    }\n"+
                        "}\n"
        ).run();
    }
}