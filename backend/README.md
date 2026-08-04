# 🛒 NexusCart-AI

> A Production-Ready MERN E-Commerce Backend built with Node.js, Express.js, MongoDB, Joi Validation, and Cloudinary.

---

## 🚀 Project Overview

**NexusCart-AI** is a scalable E-Commerce backend focused on clean architecture, security, and production-ready coding practices.

The goal of this project is to build an industry-standard backend by following best practices used in real-world MERN applications.

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi Validation
* Dotenv
* Cloudinary *(Integration Coming Soon)*
* Multer *(Integration Coming Soon)*

---

# 📁 Project Structure

```text
backend/
│
├── config/
│   ├── config.env
│   └── db.js
│
├── controllers/
│   └── createProductController.js
│
├── middlewares/
│   ├── asyncHandler.js
│   ├── error.js
│   └── validate.js
│
├── models/
│   └── productModel.js
│
├── routes/
│   └── productRoutes.js
│
├── utils/
│   └── ErrorHandler.js
│
├── validators/
│   └── productValidator.js
│
├── app.js
├── server.js
└── package.json
```

---

# ✅ Features Completed

## ✔ Express Server Setup

* Express Application
* Environment Variables
* MongoDB Connection
* API Routing

---

## ✔ MongoDB Integration

* Mongoose Connected
* Database Configuration
* Environment-based Connection

---

## ✔ Product Model

Implemented Product Schema with:

* Product Name
* Description
* Price
* Category
* Stock
* Ratings
* Images
* Reviews
* Created By (User)
* Automatic Timestamps

---

## ✔ Joi Validation

Implemented request validation for:

* Product Name
* Description
* Price
* Category
* Stock

Validation occurs before the controller executes.

---

## ✔ Validation Middleware

Created a reusable validation middleware.

Responsibilities:

* Validate Request Body
* Return HTTP 400 on validation failure
* Return all validation errors together
* Prevent invalid requests from reaching controllers

---

## ✔ Async Handler

Reusable async wrapper to eliminate repetitive `try...catch` blocks in controllers.

Benefits:

* Cleaner Controllers
* Automatic Promise Error Handling
* Easy Maintenance

---

## ✔ Global Error Handler

Implemented centralized error middleware.

Responsibilities:

* Handle application errors
* Return consistent JSON responses
* Support custom status codes

---

## ✔ Custom Error Class

Created reusable `ErrorHandler` class.

Benefits:

* Custom Status Codes
* Better Error Management
* Cleaner Controller Logic

---

## ✔ Create Product API

Endpoint:

```http
POST /api/v1/products
```

Current Flow:

```text
Client
   │
   ▼
Express Route
   │
   ▼
Joi Validation
   │
   ▼
Controller
   │
   ▼
MongoDB
   │
   ▼
JSON Response
```

---

# 📌 Current Architecture

```text
Client
   │
   ▼
Routes
   │
   ▼
Validation Middleware
   │
   ▼
Controller
   │
   ▼
MongoDB
   │
   ▼
Success Response
```

Error Flow:

```text
Client
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Async Handler
   │
   ▼
Global Error Middleware
   │
   ▼
JSON Error Response
```

---

# 🚧 Upcoming Features

* Multer Integration
* Cloudinary Image Upload
* Update Product API
* Delete Product API
* Get All Products API
* Get Single Product API
* Search
* Filtering
* Pagination
* Sorting
* JWT Authentication
* Role-Based Authorization (Admin/User)
* User Module
* Cart Module
* Wishlist Module
* Orders Module
* Reviews & Ratings
* Payment Gateway Integration
* Security (Helmet, Rate Limiting, CORS)

---

# 📌 Project Goal

Build a production-ready MERN E-Commerce backend following clean architecture, scalable design, and industry best practices.

---

## 👨‍💻 Author

**Hardeep Singh**

Building **NexusCart-AI** as a placement-ready and production-grade MERN E-Commerce project.
