import java.nio.file.*;


public class Test {
    public static void main(String[] args) throws Exception {
        System.out.println(System.in.available());
        System.out.println(new String(System.in.readNBytes(10)));
        System.out.println("hello world!");
        System.err.println("hello error!");
        System.out.println("hello world2!");
        System.out.println("hello world3!");
        System.err.println("hello error2!");
        System.out.println("hello world4!");
        var x = 1;
        var person = new Person("Peter");
        var path = Path.of("/tmp");
    }

    public static class Person {
        public String name;
        private int age;

        public Person(String name) {
            this(name, 1);
        }

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }
}