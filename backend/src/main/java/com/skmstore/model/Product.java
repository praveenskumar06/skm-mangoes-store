package com.skmstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_active", columnList = "active"),
        @Index(name = "idx_product_name", columnList = "name")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @DecimalMin(value = "0.01", message = "Sale price must be greater than 0")
    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Lob
    @Column(name = "image", columnDefinition = "BLOB") // Using BLOB for H2 compatibility, Postgres will likely need
                                                       // BYTEA or OID, but standard Hibernate usually handles byte[]
                                                       // well.
    private byte[] image;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(name = "stock_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal stockKg = BigDecimal.ZERO;

    @NotNull
    @DecimalMin(value = "1.00")
    @Column(name = "min_order_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal minOrderKg = new BigDecimal("3.00");

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean special = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductAttribute> attributes = new ArrayList<>();

    public Product() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Returns the effective selling price (salePrice if set and less than original,
     * otherwise originalPrice).
     */
    public BigDecimal getEffectivePrice() {
        if (salePrice != null && salePrice.compareTo(originalPrice) < 0) {
            return salePrice;
        }
        return originalPrice;
    }

    public boolean isOnSale() {
        return salePrice != null && salePrice.compareTo(originalPrice) < 0;
    }

    public boolean isInStock() {
        return stockKg.compareTo(minOrderKg) >= 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public BigDecimal getStockKg() {
        return stockKg;
    }

    public void setStockKg(BigDecimal stockKg) {
        this.stockKg = stockKg;
    }

    public BigDecimal getMinOrderKg() {
        return minOrderKg;
    }

    public void setMinOrderKg(BigDecimal minOrderKg) {
        this.minOrderKg = minOrderKg;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getSpecial() {
        return special;
    }

    public void setSpecial(Boolean special) {
        this.special = special;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ProductAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ProductAttribute> attributes) {
        this.attributes = attributes;
    }
}
