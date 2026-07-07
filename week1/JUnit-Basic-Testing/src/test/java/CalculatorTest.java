import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CalculatorTest {

    @Test
    void testAddition() {

        Calculator calculator = new Calculator();

        int result = calculator.add(10, 20);

        assertEquals(30, result);

    }

}