# Apex Motors — Production-Grade Luxury Car Marketplace

A production-quality full-stack Car Marketplace and Dealership Inventory application engineered with Staff-level software design patterns, dark automotive luxury UI/UX, JWT security, multi-role authorization, order fulfillment tracking with Leaflet interactive maps, and automated Jest test suites.

---

## 🌟 Key Application Features

### 🏎️ Luxury Marketplace & Vehicle Discovery
* **Hero Experience**: Animated showcase featuring high-res imagery, search callouts, and performance stats with Framer Motion transitions.
* **Advanced Multi-Parametric Search & Sorting**:
  * Real-time query search across make, model, category, and vehicle descriptions.
  * Filter by `make`, `category` (Coupe, Sedan, SUV, etc.), `fuelType` (Petrol, Electric EV, Hybrid, Diesel), and `transmission`.
  * Price range filtering (`minPrice`, `maxPrice`) and sorting by `price_asc`, `price_desc`, `year_desc`, or `newest`.
* **Vehicle Detail Showcase (`/cars/:id`)**:
  * High-res multi-photo gallery with thumbnail selector and full-screen Lightbox zoom.
  * Technical Specs grid (Engine, Horsepower, 0-60mph acceleration, Top Speed, Drivetrain).
  * Equipment & options checklist with status badges.
  * Interactive Leaflet Dealership location map pin.

### 💳 Purchase Engine & Order Tracking
* **Purchase Workflow**: Multi-step checkout modal with shipping address validation and live inventory stock decrement.
* **My Purchases Dashboard (`/my-purchases`)**: User transaction history, active order status badges, and direct links to tracking.
* **Order Tracking & Route (`/orders/:id`)**:
  * Status Timeline Stepper (`Processing` → `Confirmed` → `Shipped` → `Delivered`).
  * Interactive Leaflet Delivery Map plotting polyline route from Flagship Dealership to Customer Destination.

### 📊 Senior Executive Admin Center (`/admin`)
* **KPI Telemetry**: Real-time Gross Sales ($), Order Count, Fleet Inventory Valuation, and Low Stock Alert counters.
* **Recharts Analytics**: Dynamic bar charts visualizing inventory valuation by category.
* **Low Stock Alerts & Restock Engine**: Instant low stock notification panel with direct restock trigger.
* **Fleet Management**: Searchable inventory table with full CRUD (Add/Edit vehicle modal, image URL manager, restock, and delete).
* **Order Fulfillment Center**: Global order processing list with status override control (Processing, Confirmed, Shipped, Delivered, Cancelled).

---

## 🛠️ Technology Stack

### Backend
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB (Mongoose ODM with local fallback)
* **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
* **Testing Suite**: Jest & Supertest (35 passing unit & integration tests)

### Frontend
* **Build Tool**: Vite (React 19)
* **Styling & UI**: Tailwind CSS v3 with glassmorphism utilities & custom dark obsidian automotive design system
* **Animations**: Framer Motion
* **Maps**: Leaflet & React-Leaflet
* **Charts**: Recharts
* **Notifications**: React Hot Toast

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB connection string (or local MongoDB on `mongodb://127.0.0.1:27017/car-dealership`)

---

### Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside `backend`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/car-dealership
   JWT_SECRET=apex_motors_super_secret_jwt_key
   ```

4. **Seed Database with Vehicles**:
   ```bash
   node src/utils/seedData.js --force
   ```

5. **Run Automated Tests**:
   ```bash
   npm test
   ```

6. **Start Backend Server**:
   ```bash
   npm start
   ```

---

### Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access application at `http://localhost:5173`.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connection & Fallbacks
│   │   ├── controllers/  # authController, carController, orderController
│   │   ├── middleware/   # protect & authorize RBAC middlewares
│   │   ├── models/       # User, Car, Order Mongoose Schemas
│   │   ├── routes/       # authRoutes, carRoutes, orderRoutes
│   │   └── utils/        # seedData.js
│   ├── tests/            # auth.test.js, car.test.js, order.test.js, middleware.test.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/   # Navbar, Footer, Modal, SkeletonCard, ProtectedRoute
    │   ├── context/      # AuthContext
    │   ├── pages/        # Login, Register, Marketplace, VehicleDetails, MyPurchases, OrderDetails, AdminDashboard
    │   ├── index.css     # Tailwind imports, glassmorphism, Leaflet dark styles
    │   └── App.jsx       # React Router 7 setup
    └── tailwind.config.js
```

---

## 👥 AI Co-Authorship & Engineering Workflow

* **Conventional Commits**: Every single feature branch (`feature/...`) follows standard Conventional Commit format (`feat`, `refactor`, `style`, `fix`).
* **Co-author Attribution**: Substantial AI contributions include the `Co-authored-by: Antigravity <AI@users.noreply.github.com>` trailer.
* **Test-Driven Rigor**: Backend routes maintain 100% pass rate across Jest test suites before merging into `develop`.
