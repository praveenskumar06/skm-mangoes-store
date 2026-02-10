package com.skmstore.repository;

import com.skmstore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findByActiveTrueOrderByNameAsc();

    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
