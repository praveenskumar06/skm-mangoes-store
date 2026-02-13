package com.skmstore.seed;

import com.skmstore.constants.StoreConstants;
import com.skmstore.model.*;
import com.skmstore.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final AppSettingRepository appSettingRepository;
    private final ProductRepository productRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.phone}")
    private String adminPhone;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.demo-user.phone}")
    private String demoUserPhone;

    @Value("${app.demo-user.password}")
    private String demoUserPassword;

    @Value("${app.demo-user.name}")
    private String demoUserName;

    public DataSeeder(UserRepository userRepository,
                      AppSettingRepository appSettingRepository,
                      ProductRepository productRepository,
                      ProductAttributeRepository productAttributeRepository,
                      AddressRepository addressRepository,
                      OrderRepository orderRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appSettingRepository = appSettingRepository;
        this.productRepository = productRepository;
        this.productAttributeRepository = productAttributeRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User admin = seedAdminUser();
        User demoUser = seedDemoUser();
        seedDefaultSettings();
        List<Product> products = seedDemoProducts();
        Address address = seedDemoAddress(demoUser);
        seedDemoOrders(demoUser, address, products);
    }

    private User seedAdminUser() {
        return userRepository.findByPhone(adminPhone).orElseGet(() -> {
            User admin = new User(adminName, adminPhone,
                    passwordEncoder.encode(adminPassword), Role.ROLE_ADMIN);
            admin.setEmail(StoreConstants.ADMIN_EMAIL);
            userRepository.save(admin);
            log.info("Admin account created - Phone: {}, Password: {}", adminPhone, adminPassword);
            return admin;
        });
    }

    private User seedDemoUser() {
        return userRepository.findByPhone(demoUserPhone).orElseGet(() -> {
            User user = new User(demoUserName, demoUserPhone,
                    passwordEncoder.encode(demoUserPassword), Role.ROLE_USER);
            user.setEmail(StoreConstants.DEMO_USER_EMAIL);
            userRepository.save(user);
            log.info("Demo user created - Phone: {}, Password: {}", demoUserPhone, demoUserPassword);
            return user;
        });
    }

    private void seedDefaultSettings() {
        seedSetting("season_active", "true");
        seedSetting("season_banner_text", StoreConstants.DEFAULT_SEASON_BANNER);
        seedSetting("show_tracking_to_customer", "true");
        seedSetting("delivery_zones", StoreConstants.DEFAULT_DELIVERY_ZONES_CSV);
    }

    private void seedSetting(String key, String value) {
        if (appSettingRepository.findBySettingKey(key).isEmpty()) {
            appSettingRepository.save(new AppSetting(key, value));
            log.info("Setting seeded: {} = {}", key, value);
        }
    }

    private List<Product> seedDemoProducts() {
        if (productRepository.count() > 0) {
            log.info("Products already exist, skipping seed");
            return productRepository.findAll();
        }

        List<Product> saved = new ArrayList<>();
        for (DemoData.ProductData pd : DemoData.PRODUCTS) {
            Product p = new Product();
            p.setName(pd.name());
            p.setDescription(pd.description());
            p.setOriginalPrice(pd.originalPrice());
            p.setSalePrice(pd.salePrice());
            p.setStockKg(pd.stockKg());
            p.setMinOrderKg(pd.minOrderKg());
            productRepository.save(p);

            pd.attributes().forEach((key, value) ->
                    productAttributeRepository.save(new ProductAttribute(p, key, value)));

            saved.add(p);
        }
        log.info("{} demo products seeded", saved.size());
        return saved;
    }

    private Address seedDemoAddress(User user) {
        List<Address> existing = addressRepository.findByUserId(user.getId());
        if (!existing.isEmpty()) return existing.get(0);

        DemoData.AddressData ad = DemoData.DEMO_ADDRESS;
        Address a = new Address();
        a.setUser(user);
        a.setFullName(user.getName());
        a.setPhone(user.getPhone());
        a.setAddressLine(ad.addressLine());
        a.setCity(ad.city());
        a.setState(ad.state());
        a.setPincode(ad.pincode());
        a.setIsDefault(true);
        addressRepository.save(a);
        log.info("Demo address seeded for user: {}", user.getName());
        return a;
    }

    private void seedDemoOrders(User user, Address address, List<Product> products) {
        if (orderRepository.count() > 0) {
            log.info("Orders already exist, skipping seed");
            return;
        }

        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (DemoData.OrderData od : DemoData.ORDERS) {
            Order order = new Order();
            order.setUser(user);
            order.setAddress(address);
            order.setStatus(OrderStatus.valueOf(od.status()));
            order.setPaymentStatus(PaymentStatus.valueOf(od.paymentStatus()));
            order.setCourierName(od.courierName());
            order.setTrackingId(od.trackingId());

            BigDecimal orderTotal = BigDecimal.ZERO;
            for (DemoData.OrderItemData oid : od.items()) {
                Product product = products.get(oid.productIndex());
                BigDecimal price = product.getSalePrice() != null ? product.getSalePrice() : product.getOriginalPrice();

                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setProductName(product.getName());
                item.setQuantityKg(oid.quantityKg());
                item.setPricePerKg(price);
                order.addItem(item);

                orderTotal = orderTotal.add(price.multiply(oid.quantityKg()));
            }
            order.setTotalAmount(orderTotal);

            // Set historical date before first save (bypasses @PrePersist)
            if (od.daysAgo() > 0) {
                LocalDateTime pastDate = LocalDateTime.now().minusDays(od.daysAgo());
                order.setOrderDate(pastDate);
                order.setUpdatedAt(pastDate);
            }

            orderRepository.save(order);
            totalRevenue = totalRevenue.add(orderTotal);
        }
        log.info("{} demo orders seeded (total: Rs.{})", DemoData.ORDERS.size(), totalRevenue);
    }
}
