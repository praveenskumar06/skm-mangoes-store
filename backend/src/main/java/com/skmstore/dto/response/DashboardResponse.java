package com.skmstore.dto.response;

import java.math.BigDecimal;

public class DashboardResponse {

    private long todayOrderCount;
    private BigDecimal todayRevenue;
    private long totalProducts;
    private long totalUsers;
    private long pendingOrders;

    public DashboardResponse() {
    }

    public long getTodayOrderCount() { return todayOrderCount; }
    public void setTodayOrderCount(long todayOrderCount) { this.todayOrderCount = todayOrderCount; }

    public BigDecimal getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
}
