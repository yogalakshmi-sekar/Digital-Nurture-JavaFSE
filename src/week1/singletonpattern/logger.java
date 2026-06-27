package week1.singletonpattern;

class Logger {

    // Static object reference
    private static Logger logger;

    // Private constructor
    private Logger() {
        System.out.println("Logger object created.");
    }

    // Method to return the single object
    public static Logger getInstance() {

        if (logger == null) {
            logger = new Logger();
        }

        return logger;
    }

    // Method to print log message
    public void displayMessage(String message) {
        System.out.println(message);
    }
}
