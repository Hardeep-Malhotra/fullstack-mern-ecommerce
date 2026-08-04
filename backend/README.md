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

---
# 🛒 NexusCart-AI Backend

A production-ready MERN E-Commerce backend built with **Node.js**, **Express.js**, and **MongoDB**, following clean architecture and scalable development practices.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi Validation
* Dotenv

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
│   ├── createProductController.js
│   ├── getAllProductsController.js
│   └── getSingleProductController.js
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

## Server Setup

* Express Server
* Environment Variables
* MongoDB Connection
* API Routing

---

## Product Model

Implemented a production-ready Product model with:

* Product Name
* Description
* Price
* Category
* Stock
* Ratings
* Number of Reviews
* Images
* Embedded Review Schema
* Admin/User Reference
* Automatic Timestamps

---

## Joi Validation

Created reusable validation for Product APIs.

Validated Fields:

* Name
* Description
* Price
* Category
* Stock

---

## Validation Middleware

Reusable middleware that:

* Validates request body
* Returns HTTP 400 for invalid requests
* Returns all validation errors together
* Prevents invalid data from reaching controllers

---

## Async Handler

Implemented reusable async wrapper for controllers.

Benefits:

* Removes repetitive try-catch blocks
* Automatically forwards errors to Express error middleware
* Cleaner controller code

---

## Global Error Handler

Implemented centralized error middleware for consistent API error responses.

---

## Custom Error Handler

Created reusable ErrorHandler class for custom application errors and status codes.

---

# Product APIs Completed

### Create Product

```http
POST /api/v1/products
```

Creates a new product after successful validation.

---

### Get All Products

```http
GET /api/v1/products
```

Returns all available products.

---

### Get Single Product

```http
GET /api/v1/product/:id
```

Returns a single product by its ID.

Returns **404** if the product does not exist.

---

# Current Backend Flow

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
JSON Response
```

Error Flow

```text
Controller
   │
   ▼
Async Handler
   │
   ▼
Error Middleware
   │
   ▼
JSON Error Response
```

---

# 🚧 Upcoming Features

* Update Product API
* Delete Product API
* Multer Integration
* Cloudinary Image Upload
* JWT Authentication
* Role-Based Authorization
* Search
* Filter
* Pagination
* Sorting
* Product Reviews
* Order Management
* Payment Integration

---
# 🛒 NexusCart-AI Backend

A production-ready MERN E-Commerce backend built using **Node.js**, **Express.js**, and **MongoDB**, following clean architecture and scalable backend development practices.

---

# 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Joi Validation
* Dotenv

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
│   ├── createProductController.js
│   ├── getAllProductsController.js
│   └── getSingleProductController.js
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
│   ├── ErrorHandler.js
│   └── apiFunctionality.js
│
├── validators/
│   └── productValidator.js
│
├── app.js
├── server.js
└── package.json
```

---

# ✅ Features Implemented

## 1. Express Server Setup

* Express Application
* Environment Variables
* MongoDB Connection
* API Routing

---

## 2. Product Model

Designed a production-ready Product schema with:

* Product Name
* Description
* Price
* Category
* Stock
* Ratings
* Number of Reviews
* Images
* Embedded Review Schema
* User Reference
* Automatic Timestamps

---

## 3. Embedded Review Schema

Created a reusable Review Schema inside the Product model.

Each review stores:

* User
* Name
* Rating
* Comment

---

## 4. Joi Validation

Implemented reusable request validation.

Validated fields:

* Product Name
* Description
* Price
* Category
* Stock

---

## 5. Validation Middleware

Created a reusable middleware that:

* Validates request body
* Returns HTTP 400 on invalid data
* Prevents invalid requests from reaching controllers
* Returns all validation errors together

---

## 6. Async Handler

Implemented reusable async wrapper for Express controllers.

Benefits:

* Removes repetitive try-catch blocks
* Automatically forwards rejected promises to the global error handler
* Keeps controllers clean and readable

---

## 7. Global Error Handling

Implemented centralized error handling using:

* Custom ErrorHandler Class
* Global Error Middleware

Provides consistent JSON error responses across the application.

---

# 📦 Product APIs

## Create Product

```http
POST /api/v1/products
```

Creates a new product after validating the request.

---

## Get All Products

```http
GET /api/v1/products
```

Returns all products from the database.

Supports:

* Search
* Filter
* Sort
* Pagination

---

## Get Single Product

```http
GET /api/v1/product/:id
```

Returns product details using Product ID.

Returns **404** if the product does not exist.

---

# 🔍 API Features

A reusable `APIFunctionality` class has been implemented to keep controllers clean and scalable.

---

## Search

Supports keyword search using MongoDB Regular Expressions.

Example:

```http
GET /api/v1/products?keyword=iphone
```

Searches product names in a case-insensitive manner.

---

## Filter

Supports advanced filtering.

Examples:

```http
GET /api/v1/products?category=Mobiles
```

```http
GET /api/v1/products?price[gte]=50000
```

```http
GET /api/v1/products?price[lte]=100000
```

```http
GET /api/v1/products?ratings[gte]=4
```

---

## Sort

Supports dynamic sorting.

Examples:

```http
GET /api/v1/products?sort=price
```

```http
GET /api/v1/products?sort=-price
```

```http
GET /api/v1/products?sort=ratings
```

Default sorting:

```text
Newest Products First
```

---

## Pagination

Supports paginated responses.

Example:

```http
GET /api/v1/products?page=2
```

Returns:

* Current Page
* Total Pages
* Products Per Page
* Total Filtered Products

---

# 🔄 Request Flow

```text
Client
   │
   ▼
Express Route
   │
   ▼
Validation Middleware
   │
   ▼
Controller
   │
   ▼
API Functionality
(Search → Filter → Sort → Pagination)
   │
   ▼
MongoDB
   │
   ▼
JSON Response
```

---

# ⚠ Error Flow

```text
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

* Update Product API
* Delete Product API
* Multer Integration
* Cloudinary Image Upload
* JWT Authentication
* Role-Based Authorization
* User Module
* Product Reviews API
* Cart Module
* Wishlist Module
* Order Management
* Payment Gateway Integration

---

# 🎯 Learning Outcomes

Through this module, the following backend concepts have been implemented and understood:

* REST API Design
* CRUD Operations
* Express Routing
* Middleware Architecture
* MongoDB & Mongoose
* Schema Design
* Embedded Documents
* Joi Validation
* Global Error Handling
* Async Controller Pattern
* Search using Regex
* Dynamic Filtering
* Sorting
* Pagination
* Reusable Utility Classes
* Clean Backend Architecture

---
