import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AAASetupTeardownTest {

    Calculator calculator;

    @BeforeEach
    void setUp() {

        calculator = new Calculator();

        System.out.println("Setup Completed");

    }

    @AfterEach
    void tearDown() {

        System.out.println("Test Finished");

    }

    @Test
    void testMultiply() {

        // Arrange
        int a = 5;
        int b = 4;

        // Act
        int result = calculator.multiply(a, b);

        // Assert
        assertEquals(20, result);

    }

}