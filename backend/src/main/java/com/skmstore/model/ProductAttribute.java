package com.skmstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "product_attributes", indexes = {
    @Index(name = "idx_prod_attr_product_id", columnList = "product_id")
})
public class ProductAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotBlank(message = "Attribute key is required")
    @Size(max = 100)
    @Column(name = "attr_key", nullable = false, length = 100)
    private String attrKey;

    @NotBlank(message = "Attribute value is required")
    @Size(max = 500)
    @Column(name = "attr_value", nullable = false, length = 500)
    private String attrValue;

    public ProductAttribute() {
    }

    public ProductAttribute(Product product, String attrKey, String attrValue) {
        this.product = product;
        this.attrKey = attrKey;
        this.attrValue = attrValue;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getAttrKey() { return attrKey; }
    public void setAttrKey(String attrKey) { this.attrKey = attrKey; }

    public String getAttrValue() { return attrValue; }
    public void setAttrValue(String attrValue) { this.attrValue = attrValue; }
}
