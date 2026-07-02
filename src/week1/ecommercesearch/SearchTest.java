package week1.ecommercesearch;

public class SearchTest {

    public static void main(String[] args) {

        Product[] products = {

                new Product(101, "Laptop", "Electronics", 65000),

                new Product(102, "Mouse", "Electronics", 800),

                new Product(103, "Keyboard", "Electronics", 1500),

                new Product(104, "Phone", "Electronics", 30000),

                new Product(105, "Monitor", "Electronics", 12000)

        };

        SearchService searchService = new SearchService();

        Product result = searchService.linearSearch(products, "Phone");

        if (result != null) {

            System.out.println("Product Found\n");
            System.out.println(result);

        } else {

            System.out.println("Product Not Found");

        }

    }

}