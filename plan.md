# SKM MANGOES 🥭 — Ecommerce Website Plan

## Overview
A **seasonal mango ecommerce store** selling mango varieties by the kg (minimum 3 kg order). Built with **React** frontend and **Java Spring Boot** backend, fully responsive. Delivers to **Tamil Nadu, Pondicherry & Bangalore**. Website stays visible year-round with a seasonal ON/OFF toggle.

### Business Rules
- **Product**: Mango varieties (Alphonso, Banganapalli, Kesar, etc.)
- **Unit**: Per KG, minimum order **3 KG** per variety
- **Delivery zones**: Tamil Nadu, Pondicherry, Bangalore (expandable later)
- **Delivery cost**: TBD (either included in price or added at checkout — configurable later)
- **Payment**: Razorpay (UPI, cards, net banking, wallets) — no COD for now
- **Returns/Refunds**: None (perishable goods)
- **Language**: English only
- **Notifications**: None for now (admin checks daily orders manually)

### Branding
- **Store Name**: SKM MANGOES
- **Theme**: Mango Yellow (#FFD700) + Green (#2E7D32) — natural, fruity feel
- **Logo**: Text-based logo (generated via CSS/font, no image needed initially)

### Seasonal Strategy
- Admin can toggle **"Season Open"** / **"Off-Season"** mode from settings
- **Season Open**: Full ordering enabled, banner "Mango Season 2026 is LIVE! 🥭"
- **Off-Season**: Browse-only mode, cart/checkout disabled, banner "Season starting soon!"

---

## 1. Tech Stack

### Frontend — React.js
| Aspect | Choice | Why |
|--------|--------|-----|
| **Framework** | React 18+ (with Vite) | Fast build, huge ecosystem, component-based |
| **Styling** | Tailwind CSS | Utility-first, responsive out of the box |
| **Responsive Design** | Tailwind breakpoints + CSS Flexbox/Grid | Valid across mobile, tablet, desktop |
| **State Management** | React Context API (or Redux Toolkit for growth) | Lightweight for small stores |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | Clean API calls to Spring Boot backend |

### Backend — Java Spring Boot
| Aspect | Choice | Why |
|--------|--------|-----|
| **Framework** | Spring Boot 3.x | Production-ready, REST APIs, security built-in |
| **Language** | Java 17+ | Mature, strongly typed, great for ecommerce |
| **API Style** | RESTful APIs (JSON) | Simple, well-supported by React |
| **Authentication** | Spring Security + JWT | Stateless auth, works well with React SPA |
| **Payment Gateway** | Razorpay / Stripe API | Free to integrate, pay-per-transaction only |
| **Build Tool** | Maven or Gradle | Standard Java build tools |

### Alternative Backend (Lighter Option)
If Spring Boot feels heavy for a small store, consider:
- **Node.js + Express.js** — Faster development, same language (JS) as frontend
- **Python + FastAPI** — Lightweight, easy to learn

> **Recommendation**: Stick with **Spring Boot** if you want enterprise-grade reliability and plan to scale later.

---

## 2. Database — FREE Options

| Database | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **PostgreSQL (Neon)** ⭐ | Relational | 0.5 GB storage, always free | Best overall — robust, scalable |
| **MySQL (PlanetScale)** | Relational | 5 GB storage, 1B row reads/mo | If you prefer MySQL |
| **MongoDB Atlas** | NoSQL | 512 MB shared cluster, forever free | If you want flexible schemas |
| **Supabase (PostgreSQL)** | Relational + Auth | 500 MB, built-in auth & storage | If you want auth + DB together |
| **H2 Database** | Embedded | Completely free (file-based) | Development/testing only |

> **Recommendation**: **Supabase (PostgreSQL)** — Free 500 MB, includes authentication, file storage, and real-time features. Or **Neon PostgreSQL** for a pure DB.

---

## 3. Hosting — Cost-Effective / FREE Options

### Frontend Hosting (React Static Build)
| Platform | Free Tier | Notes |
|----------|-----------|-------|
| **Vercel** ⭐ | 100 GB bandwidth, unlimited deploys | Best DX, auto-deploy from Git |
| **Netlify** | 100 GB bandwidth, 300 build min/mo | Great alternative |
| **GitHub Pages** | Unlimited for public repos | Free but no server-side features |
| **Cloudflare Pages** | Unlimited bandwidth | Fastest CDN |

> **Recommendation**: **Vercel** — Zero config for React, global CDN, free SSL.

### Backend Hosting (Spring Boot / Java) — Seasonal Optimized
| Platform | Free Tier | Scales to Zero? | Notes |
|----------|-----------|-----------------|-------|
| **Google Cloud Run** ⭐ | 2M requests/month free | ✅ Yes | **Best for seasonal** — $0 when no traffic, auto-scales during season |
| **AWS Lambda + API Gateway** | 1M requests/month free | ✅ Yes | Requires refactoring to serverless (not ideal for Spring Boot) |
| **Render** | Free web services | ✅ Spins down after 15 min | Simple, but 30s cold start on wake-up |
| **Fly.io** | 3 shared VMs free | ✅ Can scale to 0 | Good performance, machines pause when idle |
| **Railway** | $5 free credits/month | ❌ No | Credits consumed even when idle |
| **Oracle Cloud Free Tier** | 2 AMD VMs always free | ❌ Always on | Wastes resources off-season, but $0 cost |

> **Recommendation for Seasonal Store**: 
> - **Google Cloud Run** — Perfect for seasonal. Scales to **zero instances** off-season ($0 cost), auto-scales during peak. Spring Boot runs as a container. 2M free requests/month covers most small stores.
> - **Alternative**: **Render** free tier — Simpler setup, auto-sleeps after inactivity, but has cold starts (~30s).

### Seasonal Architecture Pattern
```
OFF-SEASON:                          PEAK SEASON:
┌──────────┐                         ┌──────────┐
│  Vercel   │ ← Static React         │  Vercel   │ ← Static React
│  (CDN)    │   always live,          │  (CDN)    │   handles traffic
│  $0/mo    │   shows products        │  $0/mo    │
└─────┬─────┘                         └─────┬─────┘
      │ API calls (rare)                    │ API calls (frequent)
      ▼                                     ▼
┌──────────┐                         ┌──────────────┐
│ Cloud Run │ ← 0 instances           │  Cloud Run   │ ← Auto-scales
│  (sleep)  │   scales up on          │  (1-5 inst.) │   based on load
│  $0/mo    │   first request         │  $0-5/mo     │
└─────┬─────┘                         └──────┬───────┘
      ▼                                      ▼
┌──────────┐                         ┌──────────┐
│ Supabase  │ ← DB pauses after      │ Supabase  │ ← Active
│  (idle)   │   1 week inactivity     │  (active) │
│  $0/mo    │                         │  $0/mo    │
└──────────┘                         └──────────┘
```

---

## 4. Responsive Design Strategy (All Devices)

```
Mobile-first approach using Tailwind CSS breakpoints:
- sm: 640px   (large phones)
- md: 768px   (tablets)
- lg: 1024px  (laptops)
- xl: 1280px  (desktops)
- 2xl: 1536px (large screens)
```

- Use **CSS Grid** for product listings
- Use **Flexbox** for navigation and layouts
- **Hamburger menu** on mobile, full nav on desktop
- **Touch-friendly** buttons (min 44px tap targets)
- Test with Chrome DevTools responsive mode

---

## 5. Authentication & Role System

### Login Flow
- **Single login page** (`/login`) for both users and admins
- **Two login methods**:
  1. **Phone number + password** (phone number is the username)
  2. **Google OAuth login** (via Google Sign-In)
- After login, JWT contains user role → frontend redirects based on role:
  - `ROLE_USER` → `/` (storefront)
  - `ROLE_ADMIN` → `/admin/dashboard`
- **First admin** created via a **database seed script** (run once during initial setup)
- Existing admins can **promote registered users to admin** from the admin panel
- **No phone OTP verification** for now (planned for later phase)

### Roles
| Role | Access |
|------|--------|
| `ROLE_USER` | Browse products, cart, checkout, order history |
| `ROLE_ADMIN` | Everything above + admin panel (products, orders, settings, users) |

### Security
- Admin routes protected by `@PreAuthorize("hasRole('ADMIN')")` in Spring Boot
- React frontend uses `<ProtectedRoute>` component to guard `/admin/*` routes
- JWT token stored in `localStorage`, sent via `Authorization: Bearer` header

---

## 6. Page Structure & Features

### 👤 User Pages (`/`)

| Page | Route | Features |
|------|-------|----------|
| **Home** | `/` | Seasonal banner (ON/OFF), featured mango varieties, categories |
| **Login** | `/login` | Phone + password OR Google Sign-In, role-based redirect |
| **Register** | `/register` | Name, phone (username), email (optional), password |
| **Product Catalog** | `/products` | Grid view of mango varieties, sort by price |
| **Product Detail** | `/products/:id` | Single image, name, description, price display, weight selector (min 3 kg), Add to Cart |
| **Cart** | `/cart` | Item list, quantity update (min 3 kg), remove, subtotal |
| **Checkout** | `/checkout` | Shipping address (TN/Pondy/Bangalore only), Razorpay payment |
| **My Orders** | `/orders` | Order history, status, courier/tracking info (if admin enabled visibility) |
| **Profile** | `/profile` | Edit name, phone, email, address, password |

#### Pricing Display Logic
```
If salePrice exists AND salePrice < originalPrice:
   Show:  ~~₹300/kg~~  ₹280/kg     (strikethrough + sale price)
   
If salePrice is null OR salePrice == originalPrice:
   Show:  ₹300/kg                   (single price, no strikethrough)
```

#### Off-Season Behavior
- Products are browsable but cart/checkout is disabled
- Banner: "🥭 Mango season starting soon! Stay tuned."
- "Add to Cart" button replaced with "Notify Me" or greyed out

### 🔧 Admin Pages (`/admin`)

| Page | Route | Features |
|------|-------|----------|
| **Dashboard** | `/admin/dashboard` | Today's orders, revenue, total products, sales chart, top varieties |
| **Product Management** | `/admin/products` | Table of all mango varieties with Edit/Delete buttons |
| **Add Product** | `/admin/products/add` | Form: name, description, originalPrice/kg, salePrice/kg (optional), image, stock (kg), min order (default 3 kg) |
| **Edit Product** | `/admin/products/edit/:id` | Pre-filled form, update price/salePrice/stock/details |
| **Daily Orders** | `/admin/orders/today` | **Today's orders for delivery dispatch** (see wireframe below) |
| **All Orders** | `/admin/orders` | Full order history with status/date filter |
| **User Management** | `/admin/users` | List users, promote to admin, deactivate accounts |
| **Settings** | `/admin/settings` | Season toggle (ON/OFF), banner text, show/hide tracking for customers, delivery zones |

### 📦 Daily Orders Screen (`/admin/orders/today`)
This is the **end-of-day screen** admins use to process deliveries:

```
┌─────────────────────────────────────────────────────────────┐
│  📦 Today's Orders — Feb 10, 2026              [Export CSV] │
│  Total Orders: 12    |    Revenue: ₹15,400                  │
├─────┬──────────┬────────────┬──────────┬───────┬────────────┤
│ #   │ Order ID │ Customer   │ Items    │ Total │ Status     │
├─────┼──────────┼────────────┼──────────┼───────┼────────────┤
│ 1   │ ORD-1042 │ Rahul M.   │ 3 items  │ ₹1200 │ ⬚ Pending │
│ 2   │ ORD-1043 │ Priya S.   │ 1 item   │ ₹ 450 │ ⬚ Pending │
│ 3   │ ORD-1044 │ Karthik R. │ 5 items  │ ₹3200 │ ✅ Shipped │
│ ... │          │            │          │       │            │
└─────┴──────────┴────────────┴──────────┴───────┴────────────┘

Click any row → Expanded view:
  ┌──────────────────────────────────────┐
  │ Order #ORD-1042                      │
  │ Customer: Rahul Menon               │
  │ Phone: +91 98765 43210              │
  │ Address: 12, MG Road, Bangalore     │
  │ ──────────────────────────────────── │
  │ Items:                              │
  │   1x Widget A        ₹400           │
  │   2x Widget B        ₹400 each      │
  │ ──────────────────────────────────── │
  │ Subtotal: ₹1200                     │
  │ Status: [Pending ▾] → Shipped/Out   │
  │         [Mark as Dispatched]        │
  └──────────────────────────────────────┘
```

**Features:**
- Filter by status: All / Pending / Shipped / Delivered
- **Export to CSV** — download order list for delivery partners
- Click row to expand → see full customer details, address, items, phone
- Update order status: `Pending → Shipped → Out for Delivery → Delivered`
- **Enter courier info**: Courier name (DTDC, Delhivery, BlueDart, local) + Tracking ID / AWB number
- Courier/tracking info saved to order, visible to customer if admin enables it in Settings
- Shows **summary stats** at top (total orders, revenue for the day)

---

## 7. Database Schema

```sql
-- Users table (both customers and admins)
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20) UNIQUE NOT NULL,      -- Phone is the username
    email       VARCHAR(150),                      -- Optional
    password    VARCHAR(255),                      -- BCrypt hashed (NULL for Google OAuth users)
    google_id   VARCHAR(255),                      -- Google OAuth ID
    role        VARCHAR(20) DEFAULT 'ROLE_USER',   -- ROLE_USER or ROLE_ADMIN
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Products (mango varieties)
CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,          -- e.g., "Alphonso", "Banganapalli"
    description     TEXT,
    original_price  DECIMAL(10,2) NOT NULL,         -- Price per KG (₹300/kg)
    sale_price      DECIMAL(10,2),                  -- Optional discounted price (₹280/kg), NULL = no discount
    image_url       VARCHAR(500),                   -- Single image
    stock_kg        DECIMAL(10,2) DEFAULT 0,        -- Available stock in KG
    min_order_kg    DECIMAL(10,2) DEFAULT 3,        -- Minimum order = 3 KG
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Flexible product attributes (for future fields like origin, ripeness, organic, etc.)
CREATE TABLE product_attributes (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT REFERENCES products(id) ON DELETE CASCADE,
    attr_key    VARCHAR(100) NOT NULL,              -- e.g., "origin", "ripeness"
    attr_value  VARCHAR(500) NOT NULL               -- e.g., "Ratnagiri", "Medium"
);

-- Customer addresses
CREATE TABLE addresses (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT REFERENCES users(id),
    full_name     VARCHAR(100),
    phone         VARCHAR(20),
    address_line  VARCHAR(255),
    city          VARCHAR(100),
    state         VARCHAR(100),                     -- Must be TN, Pondicherry, or Karnataka
    pincode       VARCHAR(10),
    is_default    BOOLEAN DEFAULT FALSE
);

-- Orders
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id),
    address_id      BIGINT REFERENCES addresses(id),
    total_amount    DECIMAL(10,2) NOT NULL,
    status          VARCHAR(30) DEFAULT 'PENDING',   -- PENDING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED
    payment_status  VARCHAR(20) DEFAULT 'PENDING',   -- PENDING, PAID, FAILED
    payment_id      VARCHAR(100),                     -- Razorpay payment ID
    courier_name    VARCHAR(100),                     -- e.g., DTDC, Delhivery, BlueDart
    tracking_id     VARCHAR(100),                     -- AWB / tracking number
    order_date      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Order items (line items)
CREATE TABLE order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT REFERENCES orders(id),
    product_id      BIGINT REFERENCES products(id),
    quantity_kg     DECIMAL(10,2) NOT NULL,           -- Weight in KG ordered
    price_per_kg    DECIMAL(10,2) NOT NULL,           -- Price at time of purchase (snapshot)
    product_name    VARCHAR(200)                      -- Snapshot in case product is deleted later
);

-- App settings (admin-configurable)
CREATE TABLE app_settings (
    id              BIGSERIAL PRIMARY KEY,
    setting_key     VARCHAR(100) UNIQUE NOT NULL,
    setting_value   VARCHAR(500) NOT NULL
);

-- Default settings:
-- season_active = 'true' / 'false'
-- season_banner_text = 'Mango Season 2026 is LIVE! 🥭'
-- show_tracking_to_customer = 'true' / 'false'
-- delivery_zones = 'Tamil Nadu,Pondicherry,Karnataka'
```

---

## 8. Core Features Checklist

### Authentication & Users
- [ ] Single login page (phone/password + Google OAuth)
- [ ] User registration (name, phone as username, optional email, password)
- [ ] Google OAuth integration
- [ ] JWT token authentication
- [ ] Database seed script for first admin
- [ ] Admin can promote users to admin

### User Features
- [ ] Browse mango varieties with price display
- [ ] Product detail page (single image, price/kg, min 3 kg, strikethrough logic)
- [ ] Shopping cart (min 3 kg per variety enforcement)
- [ ] Checkout with address (TN/Pondy/Bangalore validation) + Razorpay payment
- [ ] Order history with status & courier/tracking info (if admin-enabled)
- [ ] User profile management

### Admin Features
- [ ] Admin dashboard (today's orders, revenue, sales chart, top mango varieties)
- [ ] Add mango variety (name, desc, price/kg, salePrice/kg, image, stock, min order)
- [ ] Edit product details & pricing
- [ ] Delete/deactivate products
- [ ] **Daily orders screen** — view today's orders for delivery dispatch
- [ ] Order detail expansion (customer info, address, phone, items, quantities)
- [ ] Enter courier name + tracking ID per order (manual entry OR barcode scan)
- [ ] **Barcode scanner** — Scan courier barcode via phone camera → auto-fills tracking ID (Phase 6b)
- [ ] Update order status (Pending → Shipped → Out for Delivery → Delivered)
- [ ] Export daily orders to CSV
- [ ] User management — list users, promote to admin
- [ ] **Settings**: Season toggle ON/OFF, banner text, show/hide tracking for customers, delivery zones

### Responsive UI
- [ ] Mobile, Tablet, Desktop layouts (Mango Yellow + Green theme)
- [ ] Single image per product (Cloudinary free tier)

---

## 9. Project Structure

```
ecommerce-app/
├── frontend/                          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Navbar, Footer, Loader, ProtectedRoute
│   │   │   ├── product/               # ProductCard, ProductGrid, PriceDisplay
│   │   │   ├── cart/                   # CartItem, CartSummary
│   │   │   └── admin/                 # AdminSidebar, OrderRow, ProductForm
│   │   ├── pages/
│   │   │   ├── user/                  # Home, Login, Register, Products, ProductDetail
│   │   │   │                          #   Cart, Checkout, Orders, Profile
│   │   │   └── admin/                 # Dashboard, ProductList, AddProduct, EditProduct
│   │   │                              #   DailyOrders, AllOrders, UserManagement
│   │   ├── context/                   # AuthContext, CartContext
│   │   ├── services/                  # authService, productService, orderService
│   │   ├── utils/                     # priceFormatter, dateUtils, csvExport
│   │   └── App.jsx                    # Routes with role-based guards
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Spring Boot
│   ├── src/main/java/com/store/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   └── AdminController.java   # Admin-only endpoints
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   ├── ProductService.java
│   │   │   ├── OrderService.java
│   │   │   └── AdminService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   └── OrderRepository.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Category.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   └── Address.java
│   │   ├── dto/                       # Request/Response DTOs
│   │   ├── config/
│   │   │   ├── SecurityConfig.java    # Role-based access
│   │   │   ├── JwtUtil.java
│   │   │   └── CorsConfig.java
│   │   └── seed/
│   │       └── AdminSeeder.java       # Creates first admin on startup
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── data.sql                   # Optional seed data
│   └── pom.xml
│
└── README.md
```

---

## 7. Estimated Cost Summary (Seasonal Store)

| Component | Off-Season Cost | Peak Season Cost |
|-----------|----------------|-----------------|
| Frontend Hosting (Vercel) | **$0** | **$0** |
| Backend Hosting (Cloud Run) | **$0** (0 instances) | **$0** (under 2M requests) |
| Database (Supabase) | **$0** (idle) | **$0** |
| Domain Name (.com) | ~$10-12/year | ~$10-12/year |
| SSL Certificate | **$0** | **$0** |
| Payment Gateway (Stripe/Razorpay) | **$0** (no transactions) | ~2.9% per sale |
| Image Hosting (Cloudinary) | **$0** | **$0** |
| **Monthly Total** | **$0** | **$0 — $5** |
| **Yearly Total** | **$0 — $12** (domain only) | |

---

## 11. REST API Endpoints

### Public APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login → returns JWT with role |
| GET | `/api/products` | List products (paginated, filterable) |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/categories` | List categories |

### User APIs (requires `ROLE_USER` or `ROLE_ADMIN`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/cart` | Get/update cart |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | User's order history |
| GET/PUT | `/api/profile` | View/update profile |
| POST | `/api/addresses` | Add shipping address |

### Admin APIs (requires `ROLE_ADMIN`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Add mango variety |
| PUT | `/api/admin/products/:id` | Edit product (price, salePrice, stock) |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/orders/today` | **Today's orders for delivery** |
| GET | `/api/admin/orders` | All orders (filterable) |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| PUT | `/api/admin/orders/:id/courier` | Add courier name + tracking ID |
| GET | `/api/admin/orders/today/export` | Export today's orders as CSV |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id/promote` | Promote user to admin |
| GET | `/api/admin/settings` | Get app settings |
| PUT | `/api/admin/settings` | Update settings (season toggle, banner, tracking visibility) |
| GET | `/api/admin/dashboard` | Dashboard stats (revenue, orders, top varieties chart data) |

---

## 12. Build Plan & Execution Strategy

### Prerequisites ✅
- [x] Java 17+ — Installed
- [x] Node.js 18+ — Installed
- [x] Git — Installed
- [x] IDE — VS Code (split terminals for backend + frontend)
- [ ] Gradle — Will use Gradle Wrapper (no install needed)
- [ ] GitHub repo — `praveenskumar06/skm-mangoes-store`

### Build Order: Backend First → Frontend → Connect

```
STEP 1: PROJECT SETUP
├── Create GitHub repo: praveenskumar06/skm-mangoes-store
├── Initialize Spring Boot backend (Gradle, Java 17)
├── Initialize React frontend (Vite, Tailwind CSS)
├── Configure H2 in-memory DB for local dev
├── Configure application.yml for Neon/Supabase (commented out, ready to switch)
└── .gitignore, README.md

STEP 2: BACKEND (Spring Boot + Gradle)
├── 2a. JPA Entities (User, Product, ProductAttribute, Address, Order, OrderItem, AppSetting)
├── 2b. Repositories (Spring Data JPA)
├── 2c. Auth — Security config, JWT filter, login/register endpoints, Google OAuth
├── 2d. Admin seed script (first admin on startup)
├── 2e. Product APIs — CRUD + attributes
├── 2f. Cart APIs
├── 2g. Order APIs — place order, today's orders, status update, courier, CSV export
├── 2h. Settings APIs — season toggle, delivery zones, tracking visibility
├── 2i. Dashboard API — stats, charts data
├── 2j. Payment APIs — Razorpay order creation + verification
└── Test each API with H2 locally

STEP 3: FRONTEND (React + Vite + Tailwind)
├── 3a. Project scaffold + Tailwind + theme colors
├── 3b. Routing (React Router v6) + ProtectedRoute
├── 3c. AuthContext + CartContext
├── 3d. Common components (Navbar, Footer, SeasonBanner, Loader)
├── 3e. Auth pages (Login, Register — phone/password + Google)
├── 3f. Storefront (Home, ProductCatalog, ProductDetail — pricing logic, out of stock)
├── 3g. Cart + Checkout (min 3 kg, address validation, Razorpay popup)
├── 3h. My Orders (status progress bar, tracking info)
├── 3i. Admin Layout (Sidebar + Bottom Nav)
├── 3j. Admin Products (List, Add, Edit, Delete)
├── 3k. Admin Orders (Daily orders, All orders, courier entry, CSV export)
├── 3l. Admin Dashboard (stat cards, charts with Recharts)
├── 3m. Admin Settings (season toggle, delivery zones, tracking, store info)
├── 3n. Admin Users (list, promote, deactivate)
└── 3o. User Profile + Address management

STEP 4: INTEGRATION & TESTING
├── Connect frontend to backend APIs
├── End-to-end order flow test
├── Razorpay test mode integration
├── Responsive testing (mobile, tablet, desktop)
└── Fix bugs

STEP 5: DEPLOYMENT
├── Build React for production
├── Deploy frontend to Vercel
├── Dockerize Spring Boot
├── Deploy backend to Google Cloud Run
├── Connect to Neon/Supabase PostgreSQL
├── Run admin seed script
└── Final testing on live
```

### VS Code Setup
```
VS Code — Split Terminal Layout
Terminal 1 (left):   cd backend  → ./gradlew bootRun     (port 8080)
Terminal 2 (right):  cd frontend → npm run dev            (port 5173)
```

### Local Dev Database
- **H2 in-memory** database for development (no setup needed)
- Switch to **Neon/Supabase PostgreSQL** for production (change connection string in application.yml)

### GitHub Repository
- Repo: `praveenskumar06/skm-mangoes-store`
- Monorepo: `backend/` + `frontend/` in one repo
- Branch strategy: `main` (production), `dev` (development)

---

## 13. Development Roadmap (Updated)

- [ ] **Phase 1**: Project setup — React+Vite frontend, Spring Boot backend, DB schema (Neon/Supabase ready)
- [ ] **Phase 2**: Auth — Phone/password registration & login, Google OAuth, JWT, admin seed script
- [ ] **Phase 3**: Product management — Admin CRUD for mango varieties, flexible attributes
- [ ] **Phase 4**: Storefront — Product catalog, detail page, pricing display logic, seasonal banner
- [ ] **Phase 5**: Cart & Checkout — Min 3 kg enforcement, address with zone validation, Razorpay payment
- [ ] **Phase 6**: Orders — User order history, admin daily orders screen, courier/tracking entry, CSV export
- [ ] **Phase 6b**: Barcode scanning — Scan courier barcode via phone camera and auto-fill tracking ID on orders (using html5-qrcode or QuaggaJS library, free)
- [ ] **Phase 7**: Admin extras — Dashboard with charts, settings page, user management
- [ ] **Phase 8**: Responsive UI polish — Mango Yellow+Green theme, mobile/tablet/desktop testing
- [ ] **Phase 9**: Deploy — Frontend (Vercel), Backend (Cloud Run/Render), DB (Neon/Supabase)

---

## Notes
- **Seasonal advantage**: This stack costs **$0/month during off-season** — site stays visible via Vercel CDN, backend sleeps on Cloud Run.
- **⚠ Supabase free tier pauses** the database after 1 week of inactivity. Use **Neon PostgreSQL** to avoid this, or set up a weekly cron ping.
- **Cold starts**: Cloud Run has ~5-10s cold start when waking from zero. Acceptable for seasonal off-peak.
- **Flexible product attributes**: The `product_attributes` table allows adding new fields (origin, organic, ripeness) without schema changes.
- **Delivery cost**: Left configurable — can be added as a setting later (flat fee, free above X, or included in price).
- **Phone OTP**: Planned for later phase using Firebase free tier (10K verifications/month).
- **DB connection**: Application uses Spring Data JPA with PostgreSQL driver — switch between Neon and Supabase by changing `application.yml` connection string only.
- **Payment**: Razorpay has no setup fee. You only pay ~2% per transaction. Register at razorpay.com for API keys.
