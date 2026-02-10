package com.skmstore.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private BigDecimal effectivePrice;
    private boolean onSale;
    private String imageUrl;
    private BigDecimal stockKg;
    private BigDecimal minOrderKg;
    private boolean inStock;
    private boolean active;
    private Map<String, String> attributes;

    public ProductResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public BigDecimal getEffectivePrice() { return effectivePrice; }
    public void setEffectivePrice(BigDecimal effectivePrice) { this.effectivePrice = effectivePrice; }

    public boolean isOnSale() { return onSale; }
    public void setOnSale(boolean onSale) { this.onSale = onSale; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getStockKg() { return stockKg; }
    public void setStockKg(BigDecimal stockKg) { this.stockKg = stockKg; }

    public BigDecimal getMinOrderKg() { return minOrderKg; }
    public void setMinOrderKg(BigDecimal minOrderKg) { this.minOrderKg = minOrderKg; }

    public boolean isInStock() { return inStock; }
    public void setInStock(boolean inStock) { this.inStock = inStock; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Map<String, String> getAttributes() { return attributes; }
    public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
}
