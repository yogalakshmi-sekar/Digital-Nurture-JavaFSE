package week1.singletonpattern;

public class SingletonPatternTest {

    public static void main(String[] args) {

        Logger logger1 = Logger.getInstance();
        logger1.displayMessage("Application Started");

        Logger logger2 = Logger.getInstance();
        logger2.displayMessage("Reading Configuration File");

        Logger logger3 = Logger.getInstance();
        logger3.displayMessage("Application Closed");

        if (logger1 == logger2 && logger2 == logger3) {
            System.out.println("\nOnly one Logger object is created.");
        } else {
            System.out.println("\nMore than one object exists.");
        }

    }
}