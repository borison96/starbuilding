package fr.jozait.startbuildingapi.precondition;

public class Precondition {
    public interface CheckerFunction {
        boolean doCheckValue();
    }
    public static void checkValue(CheckerFunction checker, RuntimeException toThrow) {
        if (!checker.doCheckValue()) {
            throw toThrow;
        }
    }
    public static void checkValue(boolean check, RuntimeException toThrow) {
        if(!check) {
            throw toThrow;
        }
    }
}
