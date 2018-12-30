
public class Test {
    public static void main(String[] args) {
        var person = new Person("Peter");
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