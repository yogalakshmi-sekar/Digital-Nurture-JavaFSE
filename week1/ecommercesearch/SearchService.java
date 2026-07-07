package week1.ecommercesearch;

public class SearchService {

    // Linear Search
    public Product linearSearch(Product[] products, String productName) {

        for (Product product : products) {

            if (product.getProductName().equalsIgnoreCase(productName)) {
                return product;
            }

        }

        return null;
    }

}

