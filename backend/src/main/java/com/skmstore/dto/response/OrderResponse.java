package com.skmstore.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private String paymentId;
    private String courierName;
    private String trackingId;
    private LocalDateTime orderDate;
    private AddressInfo address;
    private CustomerInfo customer;
    private List<OrderItemInfo> items;

    public OrderResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public AddressInfo getAddress() { return address; }
    public void setAddress(AddressInfo address) { this.address = address; }

    public CustomerInfo getCustomer() { return customer; }
    public void setCustomer(CustomerInfo customer) { this.customer = customer; }

    public List<OrderItemInfo> getItems() { return items; }
    public void setItems(List<OrderItemInfo> items) { this.items = items; }

    public static class AddressInfo {
        private String fullName;
        private String phone;
        private String addressLine;
        private String city;
        private String state;
        private String pincode;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddressLine() { return addressLine; }
        public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
    }

    public static class CustomerInfo {
        private Long id;
        private String name;
        private String phone;
        private String email;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class OrderItemInfo {
        private Long productId;
        private String productName;
        private BigDecimal quantityKg;
        private BigDecimal pricePerKg;
        private BigDecimal lineTotal;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public BigDecimal getQuantityKg() { return quantityKg; }
        public void setQuantityKg(BigDecimal quantityKg) { this.quantityKg = quantityKg; }
        public BigDecimal getPricePerKg() { return pricePerKg; }
        public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }
        public BigDecimal getLineTotal() { return lineTotal; }
        public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    }
}
