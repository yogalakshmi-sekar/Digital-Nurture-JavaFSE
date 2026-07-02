package week1.financialforecast;

public class FinancialForecast {

    public static double forecastRevenue(double currentRevenue,
                                         double growthRate,
                                         int years) {

        return currentRevenue * Math.pow((1 + growthRate), years);
    }

    public static void main(String[] args) {

        double currentRevenue = 1000;
        double growthRate = 0.10;
        int years = 3;

        double futureRevenue = forecastRevenue(currentRevenue, growthRate, years);

        System.out.printf("Predicted Revenue after %d years = %.2f%n",
                years, futureRevenue);
    }
}