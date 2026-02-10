package com.skmstore.service;

import com.skmstore.dto.request.PlaceOrderRequest;
import com.skmstore.dto.response.OrderResponse;
import com.skmstore.exception.BusinessException;
import com.skmstore.exception.ResourceNotFoundException;
import com.skmstore.model.*;
import com.skmstore.repository.AddressRepository;
import com.skmstore.repository.OrderRepository;
import com.skmstore.repository.ProductRepository;
import com.skmstore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final SettingsService settingsService;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        AddressRepository addressRepository,
                        SettingsService settingsService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.settingsService = settingsService;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        if (!settingsService.isSeasonActive()) {
            throw new BusinessException("Ordering is disabled — mango season has not started yet");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new BusinessException("Address does not belong to the user");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PlaceOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            if (!product.getActive()) {
                throw new BusinessException("Product is not available: " + product.getName());
            }

            if (itemReq.getQuantityKg().compareTo(product.getMinOrderKg()) < 0) {
                throw new BusinessException("Minimum order for " + product.getName()
                        + " is " + product.getMinOrderKg() + " KG");
            }

            if (product.getStockKg().compareTo(itemReq.getQuantityKg()) < 0) {
                throw new BusinessException("Insufficient stock for " + product.getName()
                        + ". Available: " + product.getStockKg() + " KG");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantityKg(itemReq.getQuantityKg());
            orderItem.setPricePerKg(product.getEffectivePrice());

            order.addItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getLineTotal());

            // Deduct stock
            product.setStockKg(product.getStockKg().subtract(itemReq.getQuantityKg()));
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);

        if (request.getRazorpayPaymentId() != null) {
            order.setPaymentId(request.getRazorpayPaymentId());
            order.setRazorpayOrderId(request.getRazorpayOrderId());
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CONFIRMED);
        }

        order = orderRepository.save(order);
        return toResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return orderRepository.findTodaysOrders(startOfDay, endOfDay).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getTodaysOrdersByStatus(OrderStatus status) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return orderRepository.findTodaysOrdersByStatus(startOfDay, endOfDay, status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByOrderDateDesc(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateCourierInfo(Long orderId, String courierName, String trackingId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setCourierName(courierName);
        order.setTrackingId(trackingId);
        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CONFIRMED) {
            order.setStatus(OrderStatus.SHIPPED);
        }
        order = orderRepository.save(order);
        return toResponse(order);
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setPaymentStatus(order.getPaymentStatus().name());
        response.setPaymentId(order.getPaymentId());
        response.setCourierName(order.getCourierName());
        response.setTrackingId(order.getTrackingId());
        response.setOrderDate(order.getOrderDate());

        // Address info
        OrderResponse.AddressInfo addressInfo = new OrderResponse.AddressInfo();
        Address addr = order.getAddress();
        addressInfo.setFullName(addr.getFullName());
        addressInfo.setPhone(addr.getPhone());
        addressInfo.setAddressLine(addr.getAddressLine());
        addressInfo.setCity(addr.getCity());
        addressInfo.setState(addr.getState());
        addressInfo.setPincode(addr.getPincode());
        response.setAddress(addressInfo);

        // Customer info
        OrderResponse.CustomerInfo customerInfo = new OrderResponse.CustomerInfo();
        User user = order.getUser();
        customerInfo.setId(user.getId());
        customerInfo.setName(user.getName());
        customerInfo.setPhone(user.getPhone());
        customerInfo.setEmail(user.getEmail());
        response.setCustomer(customerInfo);

        // Items
        response.setItems(order.getItems().stream().map(item -> {
            OrderResponse.OrderItemInfo itemInfo = new OrderResponse.OrderItemInfo();
            itemInfo.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
            itemInfo.setProductName(item.getProductName());
            itemInfo.setQuantityKg(item.getQuantityKg());
            itemInfo.setPricePerKg(item.getPricePerKg());
            itemInfo.setLineTotal(item.getLineTotal());
            return itemInfo;
        }).collect(Collectors.toList()));

        return response;
    }
}
