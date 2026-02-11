package com.skmstore.seed;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public final class DemoData {

    private DemoData() {}

    public record ProductData(
            String name,
            String description,
            BigDecimal originalPrice,
            BigDecimal salePrice,
            BigDecimal stockKg,
            BigDecimal minOrderKg,
            Map<String, String> attributes
    ) {}

    public record OrderData(
            String status,
            String paymentStatus,
            String courierName,
            String trackingId,
            List<OrderItemData> items
    ) {}

    public record OrderItemData(
            int productIndex,
            BigDecimal quantityKg
    ) {}

    public record AddressData(
            String addressLine,
            String city,
            String state,
            String pincode
    ) {}

    public static final List<ProductData> PRODUCTS = List.of(
            new ProductData(
                    "Alphonso Premium",
                    "Premium Alphonso mangoes from Ratnagiri. Known as the King of Mangoes with rich, creamy texture and sweet aroma.",
                    new BigDecimal("800.00"), new BigDecimal("650.00"),
                    new BigDecimal("150.00"), new BigDecimal("2.00"),
                    Map.of("origin", "Ratnagiri, Maharashtra", "grade", "A+", "sweetness", "Very High")
            ),
            new ProductData(
                    "Banganapalli",
                    "Sweet and juicy Banganapalli mangoes from Andhra Pradesh. Large sized with thin skin and fiberless pulp.",
                    new BigDecimal("500.00"), new BigDecimal("450.00"),
                    new BigDecimal("250.00"), new BigDecimal("3.00"),
                    Map.of("origin", "Andhra Pradesh", "grade", "A", "sweetness", "High")
            ),
            new ProductData(
                    "Malgova",
                    "Malgova mangoes from Salem, Tamil Nadu. Round shaped with thick pulp, perfect for juices and desserts.",
                    new BigDecimal("400.00"), null,
                    new BigDecimal("180.00"), new BigDecimal("3.00"),
                    Map.of("origin", "Salem, Tamil Nadu", "grade", "A")
            ),
            new ProductData(
                    "Imam Pasand",
                    "Imam Pasand mangoes - the queen of mangoes. Rich, aromatic flavor with smooth buttery texture.",
                    new BigDecimal("700.00"), new BigDecimal("600.00"),
                    new BigDecimal("80.00"), new BigDecimal("2.00"),
                    Map.of("origin", "Tamil Nadu", "grade", "A+", "sweetness", "Very High")
            ),
            new ProductData(
                    "Neelam",
                    "Small but incredibly sweet Neelam mangoes. Ideal for mango pickle and fresh eating. Late season variety.",
                    new BigDecimal("300.00"), new BigDecimal("250.00"),
                    new BigDecimal("300.00"), new BigDecimal("5.00"),
                    Map.of("origin", "Tamil Nadu", "grade", "A")
            ),
            new ProductData(
                    "Totapuri",
                    "Totapuri mangoes with unique parrot-beak shape. Tangy-sweet flavor, great for salads, chutneys and mango dal.",
                    new BigDecimal("250.00"), null,
                    new BigDecimal("400.00"), new BigDecimal("5.00"),
                    Map.of("origin", "Karnataka", "grade", "B+")
            )
    );

    public static final AddressData DEMO_ADDRESS = new AddressData(
            "42, Anna Nagar Main Road, Near Roundtana",
            "Chennai", "Tamil Nadu", "600040"
    );

    public static final List<OrderData> ORDERS = List.of(
            new OrderData("DELIVERED", "PAID", "DTDC", "DTDC123456",
                    List.of(new OrderItemData(0, new BigDecimal("5.00")))),

            new OrderData("SHIPPED", "PAID", "BlueDart", "BD789012",
                    List.of(new OrderItemData(1, new BigDecimal("3.00")),
                            new OrderItemData(2, new BigDecimal("3.00")))),

            new OrderData("CONFIRMED", "PAID", null, null,
                    List.of(new OrderItemData(3, new BigDecimal("4.00")))),

            new OrderData("CONFIRMED", "PAID", null, null,
                    List.of(new OrderItemData(4, new BigDecimal("10.00")))),

            new OrderData("CONFIRMED", "PAID", null, null,
                    List.of(new OrderItemData(0, new BigDecimal("3.00")),
                            new OrderItemData(5, new BigDecimal("5.00"))))
    );
}
