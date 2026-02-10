# SKM MANGOES — Software Requirements Specification (SRS)
**Version:** 1.0  
**Date:** February 10, 2026  
**Project:** SKM MANGOES — Seasonal Mango Ecommerce Store

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **SKM MANGOES**, a seasonal ecommerce website for selling mango varieties online. It serves as the single source of truth for developers, AI agents, or any team building this application.

### 1.2 Scope
- A responsive web application (mobile, tablet, desktop) for selling mango varieties by the kilogram
- Separate user-facing storefront and admin panel
- Online payment via Razorpay
- Seasonal ON/OFF toggle for ordering
- Delivery limited to Tamil Nadu, Pondicherry, and Bangalore

### 1.3 Definitions
| Term | Definition |
|------|-----------|
| **Season** | The period when mango ordering is enabled (typically April–July) |
| **Off-Season** | Period when the site is in browse-only mode; ordering is disabled |
| **Variety** | A type of mango (e.g., Alphonso, Kesar, Banganapalli) |
| **Admin** | Store owner/operator who manages products, orders, and settings |
| **Customer/User** | A buyer who browses and purchases mangoes |

---

## 2. System Overview

### 2.1 Architecture

```
┌──────────────┐     REST API (JSON)     ┌──────────────────┐     JDBC/JPA     ┌──────────────┐
│   FRONTEND   │ ──────────────────────► │    BACKEND       │ ──────────────► │   DATABASE   │
│              │     JWT Auth Header     │                  │                 │              │
│  React 18    │ ◄────────────────────── │  Spring Boot 3.x │                 │  PostgreSQL  │
│  Vite        │                         │  Java 17+        │                 │  (Neon or    │
│  Tailwind CSS│                         │  Spring Security  │                 │   Supabase)  │
│              │                         │  Spring Data JPA │                 │              │
│  Hosted:     │                         │                  │──── HTTPS ────► │  Hosted:     │
│  Vercel CDN  │                         │  Hosted:         │                 │  Free tier   │
│  ($0)        │                         │  Cloud Run ($0)  │                 │  ($0)        │
└──────────────┘                         └────────┬─────────┘                 └──────────────┘
                                                  │
                                         ┌────────┴─────────┐
                                         │ EXTERNAL SERVICES │
                                         │ • Razorpay (pay)  │
                                         │ • Google OAuth    │
                                         │ • Cloudinary (img)│
                                         └──────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18+ |
| Frontend Build | Vite | Latest |
| CSS Framework | Tailwind CSS | 3.x |
| Routing | React Router | v6 |
| HTTP Client | Axios | Latest |
| State Management | React Context API | — |
| Charts | Recharts | Latest |
| Backend Framework | Spring Boot | 3.x |
| Language | Java | 17+ |
| Security | Spring Security + JWT | — |
| ORM | Spring Data JPA | — |
| Database | PostgreSQL | 15+ |
| Build Tool | Maven | — |
| Payment | Razorpay | — |
| Image Storage | Cloudinary | Free tier |
| Auth (Social) | Google OAuth 2.0 | — |

### 2.3 Hosting

| Component | Platform | Cost |
|-----------|----------|------|
| Frontend | Vercel | $0 |
| Backend | Google Cloud Run (scales to zero) | $0 when idle |
| Database | Neon or Supabase (PostgreSQL) | $0 free tier |
| Images | Cloudinary | $0 (25 GB free) |
| Domain | Any registrar | ~$10-12/year |

### 2.4 Branding

| Attribute | Value |
|-----------|-------|
| Store Name | SKM MANGOES |
| Primary Color | Mango Yellow `#FFD700` |
| Secondary Color | Green `#2E7D32` |
| Accent | Orange `#FF8C00` |
| Logo | Text-based (CSS/font rendered) |
| Language | English only |

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

| ID | Requirement |
|----|-------------|
| **FR-001** | System shall provide a single login page at `/login` for both customers and admins |
| **FR-002** | Users can login via **phone number + password** (phone is the username) |
| **FR-003** | Users can login via **Google OAuth** (Google Sign-In button) |
| **FR-004** | On successful login, system issues a JWT token containing user ID, role, and expiry |
| **FR-005** | JWT token is stored in `localStorage` and sent as `Authorization: Bearer <token>` header |
| **FR-006** | After login, users with `ROLE_USER` are redirected to `/` (storefront) |
| **FR-007** | After login, users with `ROLE_ADMIN` are redirected to `/admin/dashboard` |
| **FR-008** | Registration page at `/register` collects: name (required), phone (required, unique), email (optional), password (required) |
| **FR-009** | Passwords are hashed using BCrypt before storage |
| **FR-010** | The first admin account is created via a **database seed script** run once during initial setup |
| **FR-011** | Existing admins can promote any registered user to `ROLE_ADMIN` from the admin panel |
| **FR-012** | Google OAuth users have `password` field as NULL; `google_id` stores their Google identifier |
| **FR-013** | Admin routes (`/admin/*`) are protected; unauthorized users are redirected to `/login` |

### 3.2 Product Management (Admin)

| ID | Requirement |
|----|-------------|
| **FR-020** | Admin can add a new mango variety with fields: name (required), description, original_price per kg (required), sale_price per kg (optional), image, stock_kg, min_order_kg (default 3), active status |
| **FR-021** | Admin can edit any product field at any time |
| **FR-022** | Admin can delete a product; system offers "Deactivate instead" option to preserve data |
| **FR-023** | Deactivated products (`active=false`) are hidden from the storefront |
| **FR-024** | Admin can add flexible key-value attributes to any product (e.g., origin: Ratnagiri, ripeness: Medium) |
| **FR-025** | Product list page shows all varieties in a table (desktop) or card list (mobile) with image, name, price, sale price, stock, and edit/delete actions |
| **FR-026** | Products with `stock_kg = 0` are marked as "Out of Stock" |
| **FR-027** | Add/Edit product form shows a **live preview** of how the price will display on the storefront |

### 3.3 Storefront (Customer)

| ID | Requirement |
|----|-------------|
| **FR-030** | Home page displays: seasonal banner, trust badges (Farm Fresh, Fast Delivery, Quality Checked), and product grid |
| **FR-031** | Product grid shows all active products as cards with: image, name, price display, quantity selector, and "Add to Cart" button |
| **FR-032** | Product cards display in a 4-column grid (desktop), 2-column grid (mobile) |
| **FR-033** | **Pricing display logic**: If `sale_price` exists AND `sale_price < original_price`, show original price with strikethrough + sale price. Otherwise show single price only |
| **FR-034** | **Out of Stock display**: Products with `stock_kg = 0` remain visible but are greyed out (opacity ~0.6) with "Out of Stock" label; no quantity selector or Add to Cart button is shown |
| **FR-035** | Product detail page shows: large image, name, description, price display, stock availability, quantity selector (increment by 1 kg, minimum = min_order_kg), calculated total, and "Add to Cart" button |
| **FR-036** | Product detail page shows "You may also like" section with other varieties |
| **FR-037** | Products are sortable by price (low to high, high to low) |

### 3.4 Seasonal Mode

| ID | Requirement |
|----|-------------|
| **FR-040** | Admin can toggle season ON/OFF from Settings page |
| **FR-041** | When **Season = ON**: Banner shows customizable text (e.g., "Mango Season 2026 is LIVE! 🥭"), full ordering is enabled |
| **FR-042** | When **Season = OFF**: Banner shows off-season message (e.g., "Season starting soon!"), products are browsable but cart/checkout is disabled, "Add to Cart" buttons are greyed out |
| **FR-043** | Season status and banner text are stored in `app_settings` table |
| **FR-044** | The frontend fetches season status on page load and conditionally enables/disables ordering |

### 3.5 Shopping Cart

| ID | Requirement |
|----|-------------|
| **FR-050** | Users can add products to cart with a quantity (in kg) |
| **FR-051** | Minimum quantity per variety is enforced (default 3 kg, configurable per product via `min_order_kg`) |
| **FR-052** | Quantity selector increments/decrements by 1 kg (cannot go below minimum) |
| **FR-053** | Users can update quantity or remove items from cart |
| **FR-054** | Cart displays: product image, name, price per kg, quantity, subtotal per item, and overall total |
| **FR-055** | Cart is disabled (empty state message) when season is OFF |
| **FR-056** | Cart badge on navbar shows item count |

### 3.6 Checkout & Payment

| ID | Requirement |
|----|-------------|
| **FR-060** | Checkout is a 3-step flow: ① Address → ② Review → ③ Payment |
| **FR-061** | Step 1 — Address: User selects saved address or enters new one (full name, phone, address line, city, state, pincode) |
| **FR-062** | State field is restricted to: Tamil Nadu, Pondicherry, Karnataka. Other states show error: "We currently deliver to TN, Pondicherry & Bangalore only" |
| **FR-063** | Delivery zones are configurable by admin in Settings (expandable to more states later) |
| **FR-064** | Step 2 — Review: Shows order summary (items, quantities, prices, delivery address). User confirms before payment |
| **FR-065** | Step 3 — Payment: Razorpay checkout popup opens with the order total. Supports UPI, cards, net banking, wallets |
| **FR-066** | On successful payment: order is saved with `status=PENDING`, `payment_status=PAID`, Razorpay `payment_id` is stored, product stock is decremented |
| **FR-067** | On failed payment: user is shown error message with option to retry |
| **FR-068** | Order confirmation page shows: order ID, total, payment method, delivery address, and links to "View My Orders" and "Continue Shopping" |
| **FR-069** | Delivery fee handling is configurable in admin settings: included in price / flat fee / free above threshold. Default: included in price |
| **FR-070** | System validates stock availability before allowing checkout. If stock insufficient, show error |

### 3.7 Order Management (Customer)

| ID | Requirement |
|----|-------------|
| **FR-080** | "My Orders" page at `/orders` shows all past orders sorted by date (newest first) |
| **FR-081** | Each order card shows: order ID, date, items summary, total, status badge, and progress bar |
| **FR-082** | Order status progress bar: `Ordered → Shipped → Out for Delivery → Delivered` |
| **FR-083** | Courier name and tracking ID are shown on the order card **only if** admin has enabled "Show tracking to customers" in Settings |

### 3.8 Order Management (Admin)

| ID | Requirement |
|----|-------------|
| **FR-090** | Daily Orders page at `/admin/orders/today` shows all orders placed today |
| **FR-091** | Daily Orders table columns: Order ID, Customer Name, Phone, City, Items count, Total, Status, Actions |
| **FR-092** | Clicking an order row expands to show: full customer name, phone, complete address, list of items with variety name and quantity in kg, subtotal |
| **FR-093** | Admin can update order status via dropdown: `Pending → Shipped → Out for Delivery → Delivered` |
| **FR-094** | Admin can enter courier name (text field or dropdown: DTDC, Delhivery, BlueDart, or custom) and tracking ID per order |
| **FR-095** | Daily Orders page shows summary stats at top: total orders count, total revenue for the day |
| **FR-096** | Admin can filter orders by status (All / Pending / Shipped / Out for Delivery / Delivered) |
| **FR-097** | Admin can export today's orders as CSV file. CSV includes: Order ID, Customer Name, Phone, Address, City, State, Pincode, Items, Total, Status |
| **FR-098** | All Orders page at `/admin/orders` shows full order history with date range and status filters |

### 3.9 Admin Dashboard

| ID | Requirement |
|----|-------------|
| **FR-100** | Dashboard at `/admin/dashboard` shows 4 stat cards: Today's Orders, Today's Revenue, Total Products, Total Customers |
| **FR-101** | Revenue line chart showing revenue over time with time filter: This Week / This Month / This Season |
| **FR-102** | Top Varieties horizontal bar chart showing sales by variety (in kg) |
| **FR-103** | Recent Orders list showing last 5 orders with status badges |
| **FR-104** | Orders by Status bar chart (Pending, Shipped, Out for Delivery, Delivered counts) |
| **FR-105** | Season status indicator (🟢 ON / 🔴 OFF) visible on dashboard |

### 3.10 Admin Settings

| ID | Requirement |
|----|-------------|
| **FR-110** | Season Control: ON/OFF toggle switch with live banner preview |
| **FR-111** | Customizable banner text for both season-active and off-season states |
| **FR-112** | Delivery Zones: Checkboxes for Tamil Nadu, Pondicherry, Karnataka (expandable to other states) |
| **FR-113** | Delivery Fee: Radio options — Included in price / Flat fee (₹ amount) / Free above (₹ threshold). Default: included in price |
| **FR-114** | Show Tracking to Customers: ON/OFF toggle. When OFF, courier and tracking info is hidden from customer's My Orders page |
| **FR-115** | Minimum Order per Variety: Configurable default (default: 3 kg) |
| **FR-116** | Store Info: Editable store name, contact phone, email, WhatsApp number (shown in footer) |

### 3.11 User Management (Admin)

| ID | Requirement |
|----|-------------|
| **FR-120** | Admin can view list of all registered users with: name, phone, email, role, registration date, active status |
| **FR-121** | Admin can promote a user to `ROLE_ADMIN` |
| **FR-122** | Admin can deactivate a user account (prevents login) |

### 3.12 User Profile

| ID | Requirement |
|----|-------------|
| **FR-130** | User can view and edit: name, phone, email, password |
| **FR-131** | User can manage saved addresses (add, edit, delete, set default) |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR-001** | Website must be fully responsive: mobile (< 640px), tablet (640-1024px), desktop (> 1024px) |
| **NFR-002** | Mobile layout: 2-column product grid, hamburger menu, sticky bottom buttons, bottom nav for admin |
| **NFR-003** | Desktop layout: 4-column product grid, full navbar, sidebar for admin |
| **NFR-004** | Touch-friendly: minimum 44px tap targets on all interactive elements |
| **NFR-005** | Backend must scale to zero instances during off-season ($0 cost when idle) |
| **NFR-006** | Backend cold start acceptable: < 10 seconds on Google Cloud Run |
| **NFR-007** | Frontend served via CDN (Vercel) — always available, even when backend is sleeping |
| **NFR-008** | Database connection configurable via `application.yml` — switch between Neon and Supabase by changing connection string only |
| **NFR-009** | All API responses in JSON format |
| **NFR-010** | JWT token expiry: 24 hours |
| **NFR-011** | Passwords hashed with BCrypt (strength 10+) |
| **NFR-012** | CORS configured to allow frontend domain only |
| **NFR-013** | No returns/refunds functionality (perishable goods) |
| **NFR-014** | Monthly cost during off-season: $0 (excluding domain) |
| **NFR-015** | Monthly cost during peak season: $0-5 (within free tier limits) |

---

## 5. Database Schema

```sql
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20) UNIQUE NOT NULL,
    email       VARCHAR(150),
    password    VARCHAR(255),
    google_id   VARCHAR(255),
    role        VARCHAR(20) DEFAULT 'ROLE_USER',
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    original_price  DECIMAL(10,2) NOT NULL,
    sale_price      DECIMAL(10,2),
    image_url       VARCHAR(500),
    stock_kg        DECIMAL(10,2) DEFAULT 0,
    min_order_kg    DECIMAL(10,2) DEFAULT 3,
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_attributes (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT REFERENCES products(id) ON DELETE CASCADE,
    attr_key    VARCHAR(100) NOT NULL,
    attr_value  VARCHAR(500) NOT NULL
);

CREATE TABLE addresses (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT REFERENCES users(id),
    full_name     VARCHAR(100),
    phone         VARCHAR(20),
    address_line  VARCHAR(255),
    city          VARCHAR(100),
    state         VARCHAR(100),
    pincode       VARCHAR(10),
    is_default    BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id),
    address_id      BIGINT REFERENCES addresses(id),
    total_amount    DECIMAL(10,2) NOT NULL,
    status          VARCHAR(30) DEFAULT 'PENDING',
    payment_status  VARCHAR(20) DEFAULT 'PENDING',
    payment_id      VARCHAR(100),
    courier_name    VARCHAR(100),
    tracking_id     VARCHAR(100),
    order_date      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT REFERENCES orders(id),
    product_id      BIGINT REFERENCES products(id),
    quantity_kg     DECIMAL(10,2) NOT NULL,
    price_per_kg    DECIMAL(10,2) NOT NULL,
    product_name    VARCHAR(200)
);

CREATE TABLE app_settings (
    id              BIGSERIAL PRIMARY KEY,
    setting_key     VARCHAR(100) UNIQUE NOT NULL,
    setting_value   VARCHAR(500) NOT NULL
);
```

### Default Settings (seed data)
```sql
INSERT INTO app_settings (setting_key, setting_value) VALUES
('season_active', 'true'),
('season_banner_text', 'Mango Season 2026 is LIVE! 🥭'),
('offseason_banner_text', 'Mango season starting soon! Stay tuned 🥭'),
('show_tracking_to_customer', 'true'),
('delivery_zones', 'Tamil Nadu,Pondicherry,Karnataka'),
('delivery_fee_type', 'included'),
('delivery_fee_amount', '0'),
('delivery_free_above', '0'),
('min_order_kg_default', '3'),
('store_name', 'SKM MANGOES'),
('store_phone', ''),
('store_email', ''),
('store_whatsapp', '');
```

---

## 6. REST API Specification

### 6.1 Public APIs (No authentication required)

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| POST | `/api/auth/register` | `{ name, phone, email?, password }` | `{ token, user: { id, name, role } }` |
| POST | `/api/auth/login` | `{ phone, password }` | `{ token, user: { id, name, role } }` |
| POST | `/api/auth/google` | `{ googleToken }` | `{ token, user: { id, name, role } }` |
| GET | `/api/products` | Query: `?sort=price_asc` | `[{ id, name, originalPrice, salePrice, imageUrl, stockKg, minOrderKg }]` |
| GET | `/api/products/{id}` | — | `{ id, name, description, originalPrice, salePrice, imageUrl, stockKg, minOrderKg, attributes }` |
| GET | `/api/settings/public` | — | `{ seasonActive, bannerText, deliveryZones }` |

### 6.2 User APIs (Requires `ROLE_USER` or `ROLE_ADMIN`)

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/cart` | — | `{ items: [{ productId, name, pricePerKg, quantityKg, subtotal }], total }` |
| POST | `/api/cart` | `{ productId, quantityKg }` | `{ cart }` |
| PUT | `/api/cart/{productId}` | `{ quantityKg }` | `{ cart }` |
| DELETE | `/api/cart/{productId}` | — | `{ cart }` |
| POST | `/api/orders` | `{ addressId, paymentId }` | `{ orderId, status, total }` |
| GET | `/api/orders` | — | `[{ id, orderDate, items, total, status, courierName?, trackingId? }]` |
| GET | `/api/profile` | — | `{ name, phone, email }` |
| PUT | `/api/profile` | `{ name, email, password? }` | `{ updated profile }` |
| GET | `/api/addresses` | — | `[{ id, fullName, phone, addressLine, city, state, pincode, isDefault }]` |
| POST | `/api/addresses` | `{ fullName, phone, addressLine, city, state, pincode }` | `{ address }` |
| PUT | `/api/addresses/{id}` | `{ fields to update }` | `{ address }` |
| DELETE | `/api/addresses/{id}` | — | `204 No Content` |
| POST | `/api/payments/create-order` | `{ amount }` | `{ razorpayOrderId, amount, currency }` |
| POST | `/api/payments/verify` | `{ razorpayPaymentId, razorpayOrderId, razorpaySignature }` | `{ verified: true/false }` |

### 6.3 Admin APIs (Requires `ROLE_ADMIN`)

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| POST | `/api/admin/products` | `{ name, description, originalPrice, salePrice?, imageUrl, stockKg, minOrderKg }` | `{ product }` |
| PUT | `/api/admin/products/{id}` | `{ fields to update }` | `{ product }` |
| DELETE | `/api/admin/products/{id}` | — | `204 No Content` |
| POST | `/api/admin/products/{id}/attributes` | `{ key, value }` | `{ attribute }` |
| DELETE | `/api/admin/products/{id}/attributes/{attrId}` | — | `204 No Content` |
| GET | `/api/admin/orders/today` | Query: `?status=PENDING` | `[{ id, customer, phone, address, items, total, status, courierName, trackingId }]` |
| GET | `/api/admin/orders` | Query: `?status=&from=&to=` | `[{ orders }]` |
| PUT | `/api/admin/orders/{id}/status` | `{ status }` | `{ order }` |
| PUT | `/api/admin/orders/{id}/courier` | `{ courierName, trackingId }` | `{ order }` |
| GET | `/api/admin/orders/today/export` | — | CSV file download |
| GET | `/api/admin/dashboard` | — | `{ todayOrders, todayRevenue, totalProducts, totalCustomers, revenueChart, topVarieties, ordersByStatus }` |
| GET | `/api/admin/users` | — | `[{ id, name, phone, email, role, active, createdAt }]` |
| PUT | `/api/admin/users/{id}/promote` | — | `{ user }` |
| PUT | `/api/admin/users/{id}/deactivate` | — | `{ user }` |
| GET | `/api/admin/settings` | — | `{ all settings }` |
| PUT | `/api/admin/settings` | `{ key: value pairs }` | `{ updated settings }` |

---

## 7. Page Structure

### 7.1 User Pages

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Home (banner + product grid) | No |
| `/login` | Login (phone/password + Google) | No |
| `/register` | Registration | No |
| `/products` | Product catalog | No |
| `/products/:id` | Product detail | No |
| `/cart` | Shopping cart | Yes |
| `/checkout` | Checkout (address → review → pay) | Yes |
| `/orders` | My Orders (history + tracking) | Yes |
| `/profile` | User profile & addresses | Yes |

### 7.2 Admin Pages

| Route | Page | Auth Required |
|-------|------|--------------|
| `/admin/dashboard` | Dashboard (stats, charts) | ROLE_ADMIN |
| `/admin/products` | Product list | ROLE_ADMIN |
| `/admin/products/add` | Add product form | ROLE_ADMIN |
| `/admin/products/edit/:id` | Edit product form | ROLE_ADMIN |
| `/admin/orders/today` | Daily orders for delivery | ROLE_ADMIN |
| `/admin/orders` | All orders history | ROLE_ADMIN |
| `/admin/users` | User management | ROLE_ADMIN |
| `/admin/settings` | App settings | ROLE_ADMIN |

---

## 8. Project Structure

```
skm-mangoes/
├── frontend/                          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Navbar, Footer, Loader, ProtectedRoute, SeasonBanner
│   │   │   ├── product/               # ProductCard, ProductGrid, PriceDisplay, QuantitySelector
│   │   │   ├── cart/                   # CartItem, CartSummary
│   │   │   └── admin/                 # AdminSidebar, AdminBottomNav, OrderRow, ProductForm, StatCard
│   │   ├── pages/
│   │   │   ├── user/                  # Home, Login, Register, Products, ProductDetail, Cart, Checkout, Orders, Profile
│   │   │   └── admin/                 # Dashboard, ProductList, AddProduct, EditProduct, DailyOrders, AllOrders, UserManagement, Settings
│   │   ├── context/                   # AuthContext, CartContext
│   │   ├── services/                  # authService, productService, orderService, settingsService
│   │   ├── utils/                     # priceFormatter, dateUtils, csvExport
│   │   └── App.jsx                    # Routes with role-based guards
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Spring Boot
│   ├── src/main/java/com/skmmangoes/
│   │   ├── controller/                # AuthController, ProductController, CartController, OrderController, AdminController, SettingsController
│   │   ├── service/                   # UserService, ProductService, OrderService, PaymentService, AdminService, SettingsService
│   │   ├── repository/                # UserRepository, ProductRepository, OrderRepository, AddressRepository, SettingsRepository
│   │   ├── model/                     # User, Product, ProductAttribute, Address, Order, OrderItem, AppSetting
│   │   ├── dto/                       # Request/Response DTOs for each entity
│   │   ├── config/                    # SecurityConfig, JwtFilter, JwtUtil, CorsConfig
│   │   └── seed/                      # AdminSeeder (creates first admin on startup)
│   ├── src/main/resources/
│   │   ├── application.yml            # DB connection, JWT secret, Razorpay keys
│   │   └── data.sql                   # Default settings seed data
│   └── pom.xml
│
└── README.md
```

---

## 9. UI/UX Specifications

### 9.1 Design System

| Element | Specification |
|---------|--------------|
| Primary Color | `#FFD700` (Mango Yellow) |
| Secondary Color | `#2E7D32` (Green) |
| Accent Color | `#FF8C00` (Orange) |
| Error Color | `#DC2626` (Red) |
| Background | `#FFFEF5` (Warm white) |
| Font | System font stack (Inter or similar sans-serif) |
| Border Radius | 8px (cards), 6px (buttons), 4px (inputs) |
| Shadows | Subtle (`shadow-sm` to `shadow-md`) |

### 9.2 Responsive Breakpoints (Tailwind)

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Default | < 640px | Mobile: 2-col product grid, hamburger menu, sticky bottom buttons |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablet: transition layout |
| `lg` | 1024px | Desktop: 4-col product grid, full navbar, admin sidebar |
| `xl` | 1280px | Wide desktop |

### 9.3 Key UI Behaviors

| Behavior | Specification |
|----------|--------------|
| Product card (out of stock) | Card visible but greyed out (opacity 0.6), "Out of Stock" label in red/grey below price, no quantity selector or Add to Cart button |
| Price with discount | Original price with strikethrough + sale price in bold. Only when `sale_price` exists and `sale_price < original_price` |
| Price without discount | Single price displayed normally |
| Mobile Add to Cart | Sticky button at bottom of product detail page |
| Mobile Cart/Checkout | Sticky total + CTA button at bottom |
| Admin mobile | Bottom navigation bar: Dashboard, Products, Orders, Settings |
| Admin desktop | Left sidebar navigation |
| Season OFF | Banner changes, Add to Cart buttons greyed out, cart/checkout disabled |

---

## 10. Development Phases

### Phase 1 (MVP)
- [ ] Project scaffolding (React+Vite frontend, Spring Boot backend)
- [ ] Database schema creation with JPA entities
- [ ] Authentication: phone/password + Google OAuth + JWT
- [ ] Admin seed script
- [ ] Product CRUD (admin)
- [ ] Product catalog + detail page (customer)
- [ ] Pricing display logic (strikethrough)
- [ ] Out of stock display (greyed out)
- [ ] Shopping cart with min 3 kg enforcement
- [ ] Checkout with address validation (delivery zones)
- [ ] Razorpay payment integration
- [ ] Order placement + stock decrement
- [ ] Customer order history with status progress bar
- [ ] Admin daily orders screen with customer details
- [ ] Order status update (manual: Pending → Shipped → Out for Delivery → Delivered)
- [ ] Courier name + tracking ID entry (manual)
- [ ] CSV export of daily orders
- [ ] Admin dashboard with stats + charts
- [ ] Admin settings page (season toggle, banner, delivery zones, tracking visibility)
- [ ] Admin user management (promote, deactivate)
- [ ] Responsive UI (mobile, tablet, desktop)
- [ ] Mango Yellow + Green theme
- [ ] Deployment (Vercel + Cloud Run + Neon/Supabase)

---

## 11. Phase 2 (Future Enhancements)

These features are planned for future development and are NOT part of the initial build:

| ID | Feature | Description |
|----|---------|-------------|
| **P2-001** | Phone OTP verification | Verify phone number via SMS OTP using Firebase free tier (10K/month) |
| **P2-002** | Barcode scanning | Scan courier tracking barcode via phone camera using html5-qrcode or QuaggaJS library. Auto-fills tracking ID on orders. Flow (TBD): select order first then scan, or scan then select order, or bulk scan mode |
| **P2-003** | Cash on Delivery | Add COD as payment option alongside Razorpay |
| **P2-004** | WhatsApp notifications | Notify admin on new order via WhatsApp Business API |
| **P2-005** | Email notifications | Send order confirmation email to customer |
| **P2-006** | SMS notifications | SMS customer when order status changes |
| **P2-007** | Multi-language support | Add Tamil and Hindi language options |
| **P2-008** | Multiple product images | Gallery view with multiple images per variety |
| **P2-009** | Coupon codes | Discount coupon system for marketing |
| **P2-010** | Expand delivery zones | Add Kerala, Andhra Pradesh, Telangana, and other states |
| **P2-011** | Courier API integration | Auto-update order status via courier tracking APIs |
| **P2-012** | Customer ratings/reviews | Allow customers to rate and review mango varieties |
| **P2-013** | "Notify When Available" | Let customers subscribe to out-of-stock product alerts |
| **P2-014** | Redis caching | Add caching layer for product listings during peak season |
| **P2-015** | Progressive Web App (PWA) | Enable app-like experience on mobile with offline support |

---

*End of SRS Document*
