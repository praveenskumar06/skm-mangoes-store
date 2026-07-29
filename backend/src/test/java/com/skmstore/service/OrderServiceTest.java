package com.skmstore.service;

import com.skmstore.dto.response.OrderResponse;
import com.skmstore.exception.BusinessException;
import com.skmstore.model.Address;
import com.skmstore.model.Order;
import com.skmstore.model.OrderStatus;
import com.skmstore.model.PaymentStatus;
import com.skmstore.model.User;
import com.skmstore.repository.AddressRepository;
import com.skmstore.repository.OrderRepository;
import com.skmstore.repository.ProductRepository;
import com.skmstore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private SettingsService settingsService;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, userRepository, productRepository, addressRepository, settingsService);
    }

    @Test
    void getOrderForUser_shouldRejectOrderBelongingToAnotherUser() {
        Order order = new Order();
        User owner = new User();
        owner.setId(10L);
        order.setUser(owner);

        when(orderRepository.findByIdWithDetails(99L)).thenReturn(Optional.of(order));

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.getOrderForUser(20L, "ROLE_USER", 99L));

        assertEquals("Order does not belong to the user", exception.getMessage());
    }
}
