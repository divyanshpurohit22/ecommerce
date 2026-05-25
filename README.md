# FitZone 🏋️

> Your ultimate Sports & Fitness E-Commerce destination

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express.js-4.x-green?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss)

---

## Description

FitZone is a full-stack e-commerce platform for sports and fitness products. Built with Next.js 14 (App Router) on the frontend and Express.js + MongoDB on the backend, it features JWT authentication, a real-time cart system, and a fully responsive dark theme UI.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS |
| Backend    | Express.js, Node.js               |
| Database   | MongoDB Atlas (Mongoose ODM)      |
| Auth       | JWT + bcryptjs                    |
| Styling    | Tailwind CSS (dark theme, green accent) |

---

## Demo Account

```
Email:    customer@fitzone.com
Password: customer123
```

---

## Features

- **Product Catalogue** — 18 products across 5 categories (Dumbbells, Yoga, Protein, Cardio, Accessories)
- **Category Filter** — filter products by category on the products page
- **Product Detail** — image, description, stock status, quantity selector
- **Shopping Cart** — localStorage-based cart with table view (Product, Price, Qty, Subtotal, Remove)
- **Place Order** — authenticated order placement with automatic stock deduction
- **Order History** — view all past orders with itemised table breakdown
- **JWT Auth** — register / login with hashed passwords, token stored in localStorage
- **Responsive Design** — mobile-friendly Tailwind CSS dark UI with green accent

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend

```bash
cd backend
npm install
node seed.js        # Seeds DB with demo user + 18 products
npm run dev         # Starts server on http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev         # Starts Next.js on http://localhost:3000
```

### 3. Open in Browser

```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | /api/auth/register    | No   | Register new user        |
| POST   | /api/auth/login       | No   | Login + get JWT          |
| GET    | /api/products         | No   | Get all products         |
| GET    | /api/products/:id     | No   | Get single product       |
| POST   | /api/products         | No   | Add product (Postman)    |
| PUT    | /api/products/:id     | No   | Update product           |
| DELETE | /api/products/:id     | No   | Delete product           |
| POST   | /api/orders           | Yes  | Place order              |
| GET    | /api/orders/my        | Yes  | Get my orders            |

---

## Project Structure

```
FitZone/
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   └── middleware/
│       └── authMiddleware.js
│
└── frontend/
    ├── app/
    │   ├── layout.tsx        (Navbar + Footer)
    │   ├── page.tsx          (Hero + Featured Products)
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── products/
    │   │   ├── page.tsx      (Product grid + category filter)
    │   │   └── [id]/page.tsx (Product detail)
    │   ├── cart/page.tsx     (Cart table + place order)
    │   └── orders/page.tsx   (Order history)
    └── types/
        └── index.ts          (TypeScript interfaces)
```
