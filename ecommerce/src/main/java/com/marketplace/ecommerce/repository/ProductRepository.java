package com.marketplace.ecommerce.repository;

import com.marketplace.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // This interface now has methods like .findAll(), .save(), and .delete()
}