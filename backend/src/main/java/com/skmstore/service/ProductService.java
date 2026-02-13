package com.skmstore.service;

import com.skmstore.dto.request.ProductRequest;
import com.skmstore.dto.response.ProductResponse;
import com.skmstore.exception.ResourceNotFoundException;
import com.skmstore.model.Product;
import com.skmstore.model.ProductAttribute;
import com.skmstore.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToEntity(request, product);
        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        final Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        mapRequestToEntity(request, product);

        // Clear old attributes and add new ones
        product.getAttributes().clear();
        if (request.getAttributes() != null) {
            request.getAttributes().forEach((key, value) -> {
                ProductAttribute attr = new ProductAttribute(product, key, value);
                product.getAttributes().add(attr);
            });
        }

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse toggleActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(!product.getActive());
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse toggleSpecial(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setSpecial(!Boolean.TRUE.equals(product.getSpecial()));
        return toResponse(productRepository.save(product));
    }

    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void mapRequestToEntity(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setSalePrice(request.getSalePrice());
        product.setImage(request.getImage());
        product.setStockKg(request.getStockKg());
        product.setMinOrderKg(request.getMinOrderKg());

        if (request.getAttributes() != null && product.getId() == null) {
            request.getAttributes().forEach((key, value) -> {
                ProductAttribute attr = new ProductAttribute(product, key, value);
                product.getAttributes().add(attr);
            });
        }
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setSalePrice(product.getSalePrice());
        response.setEffectivePrice(product.getEffectivePrice());
        response.setOnSale(product.isOnSale());
        response.setImage(product.getImage());
        response.setStockKg(product.getStockKg());
        response.setMinOrderKg(product.getMinOrderKg());
        response.setInStock(product.isInStock());
        response.setActive(product.getActive());
        response.setSpecial(Boolean.TRUE.equals(product.getSpecial()));

        Map<String, String> attrs = new HashMap<>();
        if (product.getAttributes() != null) {
            product.getAttributes().forEach(a -> attrs.put(a.getAttrKey(), a.getAttrValue()));
        }
        response.setAttributes(attrs);

        return response;
    }
}
