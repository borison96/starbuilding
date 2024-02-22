package fr.jozait.startbuildingapi.precondition;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PreconditionTest {
    @Test
    public void givenCheckerFunctionAndRuntimeException_whenCheckerReturnFalse_ThenThrowRuntimeException() {
        assertThrows(RuntimeException.class, () -> Precondition.checkValue(
                () -> false,
                new RuntimeException("Exception occurred here")),
                "Exception occurred here");
    }
    @Test
    public void givenCheckValueAndRuntimeException_whenNotCheck_ThenThrowRuntimeException() {
        assertThrows(RuntimeException.class, () -> Precondition.checkValue(
                        false,
                        new RuntimeException("Exception occurred here")),
                "Exception occurred here");
    }
    @Test
    public void givenCheckerFunctionAndRuntimeException_whenCheckerReturnTrue_ThenDoNothing() {
        assertDoesNotThrow(() -> Precondition.checkValue(() -> true, new RuntimeException()));
    }
    @Test
    public void givenCheckValueAndRuntimeException_whenCheck_ThenDoNothing() {
        assertDoesNotThrow(() -> Precondition.checkValue(true, new RuntimeException()));
    }
}
