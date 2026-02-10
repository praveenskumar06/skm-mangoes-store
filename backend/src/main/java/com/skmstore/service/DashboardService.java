package com.skmstore.service;

import com.skmstore.dto.response.DashboardResponse;
import com.skmstore.model.OrderStatus;
import com.skmstore.repository.OrderRepository;
import com.skmstore.repository.ProductRepository;
import com.skmstore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public DashboardService(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboardStats() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        DashboardResponse response = new DashboardResponse();
        response.setTodayOrderCount(orderRepository.countTodaysOrders(startOfDay, endOfDay));
        response.setTodayRevenue(orderRepository.getTodaysRevenue(startOfDay, endOfDay));
        response.setTotalProducts(productRepository.count());
        response.setTotalUsers(userRepository.count());
        response.setPendingOrders(orderRepository.findByStatusOrderByOrderDateDesc(OrderStatus.PENDING).size());

        return response;
    }
}
