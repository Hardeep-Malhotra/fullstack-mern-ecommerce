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
# 🔐 NexusCart AI - Authentication Module

A production-ready authentication system built using **Node.js**, **Express.js**, **MongoDB**, **JWT**, **Passport.js**, and **Google OAuth 2.0**.

This module is designed with scalability and security in mind, following industry-standard authentication practices.

---

## 🚀 Features

### ✅ User Authentication

* User Registration
* User Login
* Secure Password Hashing using **bcryptjs**
* JWT Token Generation
* HttpOnly Cookie Authentication
* Protected Routes Ready
* Google OAuth 2.0 Login (Passport.js)

---

## 🔒 Security Features

* Password Hashing with bcryptjs
* JWT Authentication
* HttpOnly Cookies
* Secure Cookie Support (Production)
* SameSite Cookie Protection
* Email Validation
* Environment Variables for Secrets
* Production Ready Authentication Flow

---

## 🌐 Google OAuth Features

* Sign in with Google
* Automatic User Registration
* Existing User Login
* Account Linking using Email
* Google Profile Picture Support
* Verified Google Email Support
* Google ID Storage
* Provider Tracking

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Passport Google OAuth 2.0
* JWT (jsonwebtoken)
* bcryptjs
* Validator
* dotenv

---


---

## ⚙️ Authentication Flow

### Email & Password Authentication

```text
User Register
      │
      ▼
Validate Input
      │
      ▼
Hash Password
      │
      ▼
Store User in MongoDB
      │
      ▼
Generate JWT
      │
      ▼
Send HttpOnly Cookie
      │
      ▼
User Logged In
```

---

### Google OAuth Flow

```text
User
      │
      ▼
Continue with Google
      │
      ▼
Google Authentication
      │
      ▼
Passport Google Strategy
      │
      ▼
Check Existing User
      │
      ├── User Exists
      │       │
      │       ▼
      │    Login
      │
      └── New User
              │
              ▼
      Create Account
              │
              ▼
        Generate JWT
              │
              ▼
     Send HttpOnly Cookie
```

---

## 📦 Environment Variables

```env
PORT=8000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

COOKIE_EXPIRE=7

NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| POST   | `/api/v1/auth/register`        | Register New User     |
| POST   | `/api/v1/auth/login`           | Login User            |
| GET    | `/api/v1/auth/google`          | Google Login          |
| GET    | `/api/v1/auth/google/callback` | Google OAuth Callback |

---

## ✨ Highlights

* Production-ready authentication architecture
* JWT-based authentication
* Google OAuth integration
* Secure password hashing
* Account linking support
* HttpOnly cookie authentication
* Clean project structure
* Reusable token utility
* Environment-based configuration
* Industry-standard security practices

---

## 🚧 Upcoming Features

* Logout
* Forgot Password
* Reset Password
* Email Verification
* Update Profile
* Change Password
* Role-Based Authorization (Admin/User)
* Refresh Token Authentication
* Redis Session Management
* Two-Factor Authentication (2FA)
* AI-Powered Security Features

---
# 🔐 NexusCart AI - Authentication Module

A production-ready authentication system built with **Node.js**, **Express.js**, **MongoDB**, **JWT**, **Passport.js**, and **Google OAuth 2.0**.

This module follows modern authentication practices and is designed with security, scalability, and maintainability in mind.

---

# ✨ Features

## 👤 User Authentication

* User Registration
* User Login
* Secure Password Hashing using **bcryptjs**
* JWT Authentication
* HttpOnly Cookie Authentication
* Protected Routes
* Logout Ready

---

## 🌍 Google OAuth 2.0 Authentication

* Continue with Google
* Automatic Google Account Registration
* Google Login
* Existing Account Linking
* Google Profile Image Support
* Google Email Verification
* Google ID Storage
* OAuth Provider Tracking

---

## 🔐 Password Security

* Password Hashing using bcrypt
* Password Comparison Method
* Secure JWT Token Generation
* HttpOnly Cookies
* SameSite Cookie Protection
* Secure Cookies in Production
* Environment Variable Based Secrets

---

## 🔑 Forgot Password & Reset Password

* Forgot Password API
* Secure Reset Token Generation
* SHA-256 Token Hashing
* 15 Minute Token Expiry
* Password Reset Email
* One-Time Reset Token
* Automatic Token Cleanup
* Automatic Login After Password Reset

---

## 📧 Email Service

* Nodemailer Integration
* Gmail SMTP Support
* Dynamic Email Sender
* Plain Text Email Support
* HTML Email Ready
* Reusable Email Utility

---

# 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Passport Google OAuth 2.0
* JWT (jsonwebtoken)
* bcryptjs
* Validator
* Nodemailer
* Crypto
* dotenv

---

# 🔄 Authentication Flow

## Email & Password Login

```text
User
   │
   ▼
Register
   │
   ▼
Validate Data
   │
   ▼
Hash Password
   │
   ▼
Save User
   │
   ▼
Generate JWT
   │
   ▼
HttpOnly Cookie
   │
   ▼
Authenticated
```

---

## Google OAuth Flow

```text
User
   │
   ▼
Continue with Google
   │
   ▼
Google Authentication
   │
   ▼
Passport Google Strategy
   │
   ▼
Find Existing User
   │
   ├───────────────┐
   ▼               ▼
User Exists     New User
   │               │
   ▼               ▼
 Login       Create Account
        │
        ▼
Generate JWT
        │
        ▼
HttpOnly Cookie
        │
        ▼
Authenticated
```

---

## Forgot Password Flow

```text
User
   │
   ▼
Forgot Password
   │
   ▼
Find User
   │
   ▼
Generate Reset Token
   │
   ▼
Hash Token
   │
   ▼
Save Token in Database
   │
   ▼
Send Reset Email
   │
   ▼
User Receives Email
```

---

## Reset Password Flow

```text
User Opens Email
        │
        ▼
Reset Link
        │
        ▼
Verify Reset Token
        │
        ▼
Check Expiry
        │
        ▼
Update Password
        │
        ▼
Hash Password
        │
        ▼
Delete Reset Token
        │
        ▼
Generate JWT
        │
        ▼
Login Successfully
```

---

# 📦 Environment Variables

```env
PORT=8000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail

SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_google_app_password

SMTP_FROM_NAME=NexusCart AI
```

---

# 📡 Authentication APIs

| Method | Endpoint                             | Description           |
| ------ | ------------------------------------ | --------------------- |
| POST   | `/api/v1/auth/register`              | Register User         |
| POST   | `/api/v1/auth/login`                 | Login User            |
| GET    | `/api/v1/auth/google`                | Google Login          |
| GET    | `/api/v1/auth/google/callback`       | Google OAuth Callback |
| POST   | `/api/v1/auth/password/forgot`       | Forgot Password       |
| PUT    | `/api/v1/auth/password/reset/:token` | Reset Password        |

---

# 🔒 Security Features

* JWT Based Authentication
* HttpOnly Cookies
* Secure Cookie Configuration
* Password Hashing (bcrypt)
* SHA-256 Reset Token Hashing
* Email Validation
* Google OAuth 2.0
* One-Time Password Reset Tokens
* Reset Token Expiration
* Account Linking
* Environment Variable Configuration
* Async Error Handling
* Centralized Error Handling

---

# 🚀 Future Improvements

* Email Verification
* Refresh Token Authentication
* Role-Based Authorization
* Multi-Factor Authentication (2FA)
* Session Management with Redis
* Login Rate Limiting
* Account Lock After Failed Attempts
* Device Management
* Login History
* Email Templates
* OTP Login
* Password Strength Checker

---

# 📌 Learning Outcomes

During this module, the following concepts were implemented:

* JWT Authentication
* Cookie-Based Authentication
* Google OAuth 2.0
* Passport.js Integration
* Password Hashing
* Password Verification
* Authentication Middleware
* Protected Routes
* Forgot Password Workflow
* Password Reset Workflow
* Secure Token Generation
* SHA-256 Hashing
* SMTP Email Integration
* Nodemailer
* Environment Variables
* Secure Authentication Architecture

---
# 🛡️ Role-Based Access Control (RBAC)

A secure Role-Based Access Control (RBAC) system implemented using **JWT Authentication**, **Express Middleware**, and **MongoDB** to protect sensitive API endpoints.

This module ensures that only authorized users can access protected resources while restricting administrative operations to users with the **Admin** role.

---

# ✨ Features

* JWT Authentication Middleware
* Protected Routes
* Role-Based Authorization
* Admin Only Routes
* Public Routes
* Secure Route Chaining
* Reusable Authorization Middleware
* Scalable Role Management

---

# 👥 User Roles

Currently the application supports two roles:

| Role  | Permissions                                      |
| ----- | ------------------------------------------------ |
| User  | View products and access customer features       |
| Admin | Full product management (Create, Update, Delete) |

---

# 🔐 Authentication Middleware

The `isAuthenticatedUser` middleware is responsible for:

* Reading JWT from HttpOnly Cookies
* Supporting Bearer Token Authentication
* Verifying JWT
* Fetching User from Database
* Attaching User to `req.user`
* Blocking Unauthorized Requests

Authentication Flow

```text
Client Request
       │
       ▼
Read JWT Token
       │
       ▼
Verify JWT
       │
       ▼
Find User
       │
       ▼
Attach User to req.user
       │
       ▼
Next Middleware
```

---

# 👑 Authorization Middleware

The `authorizeRoles()` middleware checks whether the authenticated user has permission to access a specific resource.

Supported Features:

* Single Role Authorization
* Multiple Role Authorization
* Reusable Middleware
* HTTP 403 Forbidden Response
* Dynamic Role Checking

Example:

```javascript
authorizeRoles("admin")
```

or

```javascript
authorizeRoles("admin", "seller")
```

Authorization Flow

```text
Authenticated User
        │
        ▼
Read req.user.role
        │
        ▼
Role Allowed?
     │         │
    Yes       No
     │         │
     ▼         ▼
 Continue   403 Forbidden
```

---

# 🔄 Middleware Execution Order

Every protected route follows this execution pipeline:

```text
Client Request
       │
       ▼
isAuthenticatedUser
       │
       ▼
authorizeRoles()
       │
       ▼
Request Validation
       │
       ▼
Controller
       │
       ▼
Database
       │
       ▼
Response
```

Execution Order:

1. Authenticate User
2. Check User Role
3. Validate Request Body
4. Execute Controller Logic

---

# 🌐 Public Routes

Accessible without authentication.

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/v1/products`     |
| GET    | `/api/v1/products/:id` |

---

# 🔒 Protected Admin Routes

Require both authentication and admin privileges.

| Method | Endpoint               | Access |
| ------ | ---------------------- | ------ |
| POST   | `/api/v1/products`     | Admin  |
| PUT    | `/api/v1/products/:id` | Admin  |
| DELETE | `/api/v1/products/:id` | Admin  |

---

# 📂 Middleware Structure

```text
middlewares/
│
├── auth.js
│     ├── isAuthenticatedUser()
│     └── authorizeRoles()
│
├── asyncHandler.js
│
├── validate.js
│
└── error.js
```

---

# 🔐 Security Features

* JWT Token Verification
* HttpOnly Cookie Authentication
* Bearer Token Support
* Protected API Endpoints
* Admin Authorization
* Dynamic Role Validation
* Unauthorized Access Protection
* Forbidden Resource Protection

---

# 🚀 Benefits

* Clean Middleware Architecture
* Reusable Authorization Logic
* Easy to Extend with New Roles
* Production Ready Route Protection
* Separation of Authentication & Authorization
* Follows Industry Best Practices

---

# 📈 Future Enhancements

Additional roles can be added easily:

* Admin
* Seller
* Customer
* Moderator
* Delivery Partner
* Support Agent

Example:

```javascript
authorizeRoles("admin", "seller", "moderator")
```

---

# 📚 Concepts Covered

This module demonstrates the following backend concepts:

* JWT Authentication
* Authentication Middleware
* Authorization Middleware
* Role-Based Access Control (RBAC)
* Express Middleware Chaining
* Route Protection
* Secure API Design
* Permission Management
* Admin Panel Security
* Express Routing Best Practices

---
# 🛡️ API Security Layer (Helmet + Rate Limiting)

A production-ready API security module built using **Helmet.js** and **Express Rate Limit** to protect the backend against common web attacks, brute-force attempts, API abuse, and denial-of-service attacks.

This security layer is designed following industry-standard backend security practices and provides multiple layers of protection for public and authenticated APIs.

---

# 🚀 Features

## 🪖 Helmet Security

* Secure HTTP Response Headers
* Clickjacking Protection
* MIME Sniffing Protection
* Cross-Site Scripting (XSS) Mitigation
* Browser Security Enhancements
* Information Leakage Prevention
* Secure Defaults for Express Applications

---

## 🚦 API Rate Limiting

* Global API Rate Limiter
* Authentication Rate Limiter
* Password Reset Rate Limiter
* IP-Based Request Limiting
* Brute Force Protection
* Email Spam Prevention
* Route-Specific Rate Limiting
* Reusable Middleware Architecture

---

# 🛡️ Why Helmet?

Helmet automatically configures secure HTTP headers to reduce common web vulnerabilities without requiring manual header configuration.

### Helmet protects against:

* Clickjacking Attacks
* MIME Type Sniffing
* Browser Information Disclosure
* Cross-Site Scripting (XSS)
* Unsafe Browser Defaults

---

# 🚦 Why Rate Limiting?

Without rate limiting, attackers can:

* Perform brute-force login attacks
* Spam forgot password emails
* Flood backend APIs
* Overload the server
* Launch denial-of-service attempts
* Consume backend resources

Rate limiting restricts how many requests a single IP can make within a defined time window.

---

# 📊 Implemented Rate Limiters

## 🔐 Authentication Limiter

Applied On:

* Register
* Login

Configuration

* Window: **15 Minutes**
* Maximum Requests: **10**

Purpose

* Prevent Brute Force Attacks
* Reduce Fake Registrations
* Protect Authentication Endpoints

---

## 🔑 Password Reset Limiter

Applied On:

* Forgot Password

Configuration

* Window: **15 Minutes**
* Maximum Requests: **5**

Purpose

* Prevent Email Spamming
* Prevent Password Reset Abuse
* Protect SMTP Resources

---

## 🌍 Global API Limiter

Applied On:

```text id="99j0ng"
/api/v1/*
```

Configuration

* Window: **15 Minutes**
* Maximum Requests: **300**

Purpose

* Prevent API Abuse
* Protect Server Resources
* Improve Backend Stability

---

# 📂 Project Structure

```text id="9jlwmw"
backend/
│
├── middlewares/
│   ├── auth.js
│   ├── asyncHandler.js
│   ├── validate.js
│   ├── error.js
│   └── rateLimiter.js
│
├── app.js
│
└── routes/
    ├── authRoutes.js
    └── productRoutes.js
```

---

# 🔄 Security Middleware Flow

```text id="dvlm9t"
Incoming Request
        │
        ▼
Helmet Security
        │
        ▼
Global API Rate Limiter
        │
        ▼
Authentication Rate Limiter (If Required)
        │
        ▼
JWT Authentication
        │
        ▼
Role-Based Authorization
        │
        ▼
Request Validation
        │
        ▼
Controller
        │
        ▼
Database
        │
        ▼
Response
```

---

# 🌐 Route Protection

## Public APIs

| Method | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/v1/products`     |
| GET    | `/api/v1/products/:id` |

---

## Authentication APIs

| Method | Endpoint                       | Protection             |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/v1/auth/register`        | Auth Limiter           |
| POST   | `/api/v1/auth/login`           | Auth Limiter           |
| POST   | `/api/v1/auth/password/forgot` | Password Reset Limiter |

---

## Protected APIs

Protected using:

* JWT Authentication
* Role-Based Authorization
* Request Validation
* Global API Limiter

---

# 🔐 Security Benefits

## Helmet

* Secure HTTP Headers
* Reduced Browser-Based Attacks
* Better Production Readiness
* Improved Client Security
* Lower Attack Surface

---

## Rate Limiting

* Brute Force Prevention
* API Abuse Protection
* Email Spam Prevention
* DoS Mitigation
* Resource Protection
* Stable API Performance

---


---

# ⚙️ Middleware Execution Order

```text id="yzvnft"
Client Request
       │
       ▼
Helmet
       │
       ▼
Global Rate Limiter
       │
       ▼
Authentication Rate Limiter
       │
       ▼
JWT Authentication
       │
       ▼
Authorization (RBAC)
       │
       ▼
Request Validation
       │
       ▼
Business Logic
       │
       ▼
Database
       │
       ▼
Response
```

---

# 📚 Concepts Covered

This module demonstrates the implementation of:

* Helmet.js
* Express Rate Limit
* API Security
* HTTP Security Headers
* IP-Based Rate Limiting
* Route-Specific Middleware
* Authentication Protection
* Brute Force Prevention
* Email Spam Prevention
* Middleware Chaining
* Secure Express Architecture
* Production Backend Security

---

# 🚀 Future Improvements

* Redis-Based Distributed Rate Limiting
* Dynamic User-Based Limits
* Sliding Window Algorithm
* IP Blacklisting
* Device-Based Rate Limiting
* Cloudflare / WAF Integration
* Security Monitoring Dashboard
* Request Analytics
* CAPTCHA Integration
* API Key Rate Limiting

---

# 🎯 Learning Outcomes

During this module, the following concepts were implemented:

* Helmet Security Middleware
* Secure HTTP Headers
* Express Rate Limiting
* Global API Protection
* Route-Specific Rate Limiting
* Authentication Endpoint Protection
* Password Reset Protection
* Middleware Architecture
* IP-Based Request Limiting
* Express Security Best Practices
* Production API Hardening
* Scalable Security Design

---
# 👤 Product Ownership & Admin Authorization

This module ensures that only authenticated administrators can create, update, and delete products while automatically tracking the creator of each product.

## ✨ Features

* JWT Protected Product Management
* Role-Based Product Access (Admin Only)
* Automatic Product Ownership
* User Reference using MongoDB ObjectId
* Product Creator Tracking
* Secure Backend Assignment of Creator ID
* Ownership Ready for Auditing and Analytics

---

## 🔄 Workflow

```text
Admin Login
      │
      ▼
JWT Authentication
      │
      ▼
Role Verification (Admin)
      │
      ▼
Create / Update / Delete Product
      │
      ▼
Assign req.user._id
      │
      ▼
Store Product with Creator Reference
```

---

## 📂 Product Schema

Each product stores the creator's reference using MongoDB ObjectId.

```javascript
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

---

## 🔒 Security

* Product ownership is assigned **only by the backend**.
* The client cannot manually choose the product creator.
* Only authenticated users with the **Admin** role can manage products.
* Every product maintains a reference to the admin who created it.

---

## 🚀 Benefits

* Secure Product Management
* Admin Activity Tracking
* Ownership-Based Data Relations
* Easy User Population with `populate()`
* Scalable Architecture for Future Features

---

## 📚 Concepts Covered

* JWT Authentication
* Role-Based Access Control (RBAC)
* MongoDB References
* Mongoose ObjectId
* Express Middleware Chaining
* Backend Data Ownership
* Secure API Design
# 📦 Admin Product Management API

A secure API that allows an authenticated administrator to retrieve **only the products created by their own account**.

## ✨ Features

* Admin-Only Access
* JWT Protected Route
* Fetch Products by Logged-in Admin
* User-Based Product Filtering
* Product Ownership Verification
* Secure Database Query using `req.user.id`

---

## 🔄 Workflow

```text
Admin Login
      │
      ▼
JWT Authentication
      │
      ▼
Role Verification (Admin)
      │
      ▼
Read req.user.id
      │
      ▼
Find Products
(user: req.user.id)
      │
      ▼
Return Admin's Products
```

---

## 📡 API Endpoint

| Method | Endpoint                 | Access               |
| ------ | ------------------------ | -------------------- |
| GET    | `/api/v1/admin/products` | Private (Admin Only) |

---

## 🔒 Security

* Accessible only to authenticated administrators.
* Returns only products created by the logged-in admin.
* Prevents access to products owned by other administrators.
* Uses JWT authentication and MongoDB user references for ownership validation.

---

## 📚 Concepts Covered

* JWT Authentication
* Role-Based Access Control (RBAC)
* MongoDB ObjectId References
* User-Based Data Filtering
* Secure REST API Design
* Mongoose Query Filtering
