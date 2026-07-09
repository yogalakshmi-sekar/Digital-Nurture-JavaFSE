import org.junit.Test;
import static org.junit.Assert.*;

public class CalculatorTest {

    @Test
    public void testAddition() {
        int result = 10 + 20;
        assertEquals(30, result);
    }
}
