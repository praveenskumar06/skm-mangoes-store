package com.skmstore.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 200)
    private String name;

    private String description;

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal originalPrice;

    @DecimalMin(value = "0.01", message = "Sale price must be greater than 0")
    private BigDecimal salePrice;

    @Size(max = 500)
    private String imageUrl;

    @NotNull(message = "Stock is required")
    @DecimalMin(value = "0.00")
    private BigDecimal stockKg;

    @DecimalMin(value = "1.00")
    private BigDecimal minOrderKg = new BigDecimal("3.00");

    private Map<String, String> attributes;

    public ProductRequest() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getStockKg() { return stockKg; }
    public void setStockKg(BigDecimal stockKg) { this.stockKg = stockKg; }

    public BigDecimal getMinOrderKg() { return minOrderKg; }
    public void setMinOrderKg(BigDecimal minOrderKg) { this.minOrderKg = minOrderKg; }

    public Map<String, String> getAttributes() { return attributes; }
    public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
}
