package com.skmstore.constants;

import java.util.Arrays;
import java.util.List;

/**
 * Store-wide constants — update these before going to production.
 */
public final class StoreConstants {

    private StoreConstants() {}

    // Store Info
    public static final String STORE_NAME = "SKM Mangoes";

    // Contact
    public static final String STORE_PHONE = "+91 98765 43210";
    public static final String STORE_EMAIL = "orders@skmmangoes.com";
    public static final String ADMIN_EMAIL = "admin@skmmangoes.com";
    public static final String DEMO_USER_EMAIL = "demo@skmmangoes.com";

    // Delivery
    public static final List<String> DELIVERY_ZONES = Arrays.asList(
            "Tamil Nadu", "Pondicherry", "Puducherry", "Karnataka"
    );

    // Seed data defaults
    public static final String DEFAULT_SEASON_BANNER = "Mango Season 2026 is LIVE!";
    public static final String DEFAULT_DELIVERY_ZONES_CSV = "Tamil Nadu,Pondicherry,Karnataka";
}
