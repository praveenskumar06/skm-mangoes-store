package com.skmstore.repository;

import com.skmstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.attributes WHERE p.active = true ORDER BY p.name ASC")
    List<Product> findByActiveTrueOrderByNameAsc();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.attributes WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.active = true")
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
