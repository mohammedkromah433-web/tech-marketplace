package com.marketplace.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String productNames;
    private Double totalPrice;
    private LocalDateTime orderDate = LocalDateTime.now();

    // Getters and Setters (Right-click -> Generate -> Getter and Setter)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getProductNames() { return productNames; }
    public void setProductNames(String productNames) { this.productNames = productNames; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}