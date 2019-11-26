//// test code

public class Main {
    public static void main(String[] args) throws Exception {
        try {
//        test();
        test2();
//
        } catch (Exception e) {
throw  e;
        }

//        throw new Exception("aasdf");
//        System.out.print(System.in.read());
//        System.out.println("block");
//        try {
//            try {
//                System.out.println("try");
//                throw new Exception("aasdf");
//            } catch (Exception e) {
////                System.out.println("catch");
//                throw e;
//            } finally {
////                System.out.println("finally");
//            }
//        } catch (Exception e) {
//            System.out.println("catch2");
//        }
//        System.out.println("block");
    }

    static void test2(){
        test();
    }

    static void test() {
        try {
        throw new RuntimeException("asdf");

        } catch (Exception e) {
            throw e;
        }
    }
}

//import java.util.*;
//
//public class Main {
//    public static void main(String[] args) throws Exception {
//        var b = true;
//        var i = 1234;
//        var l = 1234567891011l;
//        var f = 123.4f;
//        var d = 123.4;
//        var c = '1';
//        var s = "qwer";
//
//        var ll = List.of(i, f, c);
//        var ss = Set.of(f, c, s);
//        var mm = Map.ofEntries(
//                Map.entry('b', true),
//                Map.entry('i', 1234),
//                Map.entry('f', 123.4),
//                Map.entry('c', '1'),
//                Map.entry('s', "qwer")
//        );
//
//        var ccc = CCC.class;
//        var cci = new CCC();
//
//        System.out.print(b);
//        System.out.print(i);
//        System.out.print(f);
//        System.out.print(c);
//        System.out.print(s);
//
//        System.out.println();
//
//        System.out.println(ll);
//        System.out.println(ss);
//        System.out.println(mm);
//
//        System.out.println(ccc);
//        System.out.println(cci);
//
//        // var scan = new Scanner(System.in);
//        // var iii = scan.nextLine();
//        // System.out.println(iii);
//
//        var fff = fib(4);
//
//        try {
//            deepException(4);
//        } catch (RuntimeException e) {
//            System.out.println(e.getMessage());
//        }
//
//    }
//
//    static class CCC {
//        private boolean attribute;
//
//        public CCC() {
//            this.attribute = false;
//        }
//    }
//
//    static int fib(int i) {
//        return i <= 1 ? i : fib(i - 1) + fib(i - 2);
//    }
//
//    static void deepException(int i) {
//        if (i < 1) throw new RuntimeException("some exception");
//        deepException(i - 1);
//    }
//}