# Full-Stack Car Dealership Inventory System (TDD)

A premium, full-stack vehicle inventory management portal built with strict Test-Driven Development (TDD) principles. The system includes a secure RESTful API backend and a responsive, high-contrast single-page application (SPA) frontend.

---

## Features

### 🔐 Security & Access Control
* **JWT Token-Based Authentication**: Secure vehicle and inventory resource endpoints.
* **Role-Based Authorization**: Distinct access permissions for `User` and `Admin` accounts.

### 🚗 Vehicle & Inventory Management
* **Catalog Browsing**: Retrieve available inventory listing.
* **Precision Search**: Search vehicle models by matching `make` substrings.
* **Multi-Property Filters**: Slide-out filtering by `category`, `minPrice`, and `maxPrice`.
* **Purchase Action**: Securely purchase a vehicle, which decrements stock quantity by 1. Automatically disables buy buttons when quantity reaches 0.
* **Admin CRUD Actions (Admin Only)**:
  * **Add Vehicle**: Create new vehicles with structured selectors.
  * **Edit Details**: Update properties of existing stock.
  * **Delete Vehicle**: Permanently delete vehicle entries with safety prompts.
  * **Restock Inventory**: Restock quantities of active vehicles by a specified amount.

---

## Technology Stack

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (via Mongoose ODM)
* **Testing Suite**: Jest & Supertest

### Frontend
* **Build Tool**: Vite (React Template)
* **CSS Framework**: Tailwind CSS v3 (PostCSS & Autoprefixer)
* **Icons**: Lucide React

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB connection string (local instance or MongoDB Atlas)

---

### Backend Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run Tests (Jest)**:
   ```bash
   npm test
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Frontend Setup

1. **Navigate to the Frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## Directory Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connection
│   │   ├── controllers/  # Route Controllers (auth, car)
│   │   ├── middleware/   # JWT protection & role auth
│   │   ├── models/       # Mongoose schemas (Car, User)
│   │   └── routes/       # Express route definitions
│   ├── tests/            # Supertest integration tests
│   ├── server.js         # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Route Guards (ProtectedRoute)
    │   ├── context/      # State management (AuthContext)
    │   ├── pages/        # Main views (Login, Register, Dashboard)
    │   ├── index.css     # Tailwind imports
    │   └── App.jsx       # Routing configurations
    └── package.json
```

---

## My AI Usage

### 🤖 AI Tools Used
* **Antigravity**: Pair programmed with the Antigravity agentic coding assistant to construct the full-stack system.

### 🛠️ Collaboration & Workflows
* **Continuous Stepwise Loop (TDD)**:
  Every single endpoint and inventory logic was constructed using a strict Red-Green-Refactor loop. We wrote the failing test suite first, verified its failure (Red phase), wrote the clean code to pass it (Green phase), and refactored.
* **Mocking Mongoose Methods**:
  Since our sandboxed environment was offline, we designed tests by using Jest spies on Mongoose queries (`Car.findById`, `User.findOne`, `save`, etc.) to run test suites offline without connecting to a live cluster, maintaining execution speed and isolation.
* **Premium Design System**:
  We aligned on a Stripe/Vercel-inspired UI standard: deep slate backgrounds, emerald/violet badges, subtle micro-interactions, responsive form containers, and validation handling.

### 💡 Reflections
Adhering to TDD from the beginning eliminated common full-stack development friction. Writing tests first forced us to establish clean API interfaces before writing controller logic. Pre-mocking queries avoided database state pollution during testing, and utilizing a git trailer co-authorship protocol ensured transparent AI attribution.
