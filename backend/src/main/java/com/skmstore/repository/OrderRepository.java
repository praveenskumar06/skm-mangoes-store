package com.skmstore.repository;

import com.skmstore.model.Order;
import com.skmstore.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startOfDay AND o.orderDate < :endOfDay ORDER BY o.orderDate DESC")
    List<Order> findTodaysOrders(@Param("startOfDay") LocalDateTime startOfDay,
                                 @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startOfDay AND o.orderDate < :endOfDay AND o.status = :status ORDER BY o.orderDate DESC")
    List<Order> findTodaysOrdersByStatus(@Param("startOfDay") LocalDateTime startOfDay,
                                         @Param("endOfDay") LocalDateTime endOfDay,
                                         @Param("status") OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startOfDay AND o.orderDate < :endOfDay")
    long countTodaysOrders(@Param("startOfDay") LocalDateTime startOfDay,
                           @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate >= :startOfDay AND o.orderDate < :endOfDay AND o.paymentStatus = 'PAID'")
    java.math.BigDecimal getTodaysRevenue(@Param("startOfDay") LocalDateTime startOfDay,
                                          @Param("endOfDay") LocalDateTime endOfDay);

    List<Order> findAllByOrderByOrderDateDesc();
}
