package com.marketplace.ecommerce;

import com.marketplace.ecommerce.model.Product;
import com.marketplace.ecommerce.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }

    @Bean
    CommandLineRunner runner(ProductRepository repository) {
        return args -> {
            // 1. CLEAR OLD DATA FIRST
            repository.deleteAll();

            // 2. ADD NEW DATA WITH WORKING LINKS
            repository.save(new Product(null, "Gaming Laptop", "High performance", 1200.0, 10, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500"));
            repository.save(new Product(null, "Wireless Mouse", "Ergonomic mouse", 25.0, 50, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"));
            repository.save(new Product(null, "Mechanical Keyboard", "RGB keys", 89.0, 20, "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500"));

            System.out.println("--- Database Refreshed with 3 Working Images ---");
        };
    }
}