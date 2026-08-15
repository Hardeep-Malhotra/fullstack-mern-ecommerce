# 🎨 NexusCart AI - Frontend

The frontend of **NexusCart AI**, an e-commerce application built with React.js.

This frontend is structured to consume the backend REST APIs and provide separate experiences for public users, authenticated users, and administrators.

---

## 🚀 Frontend Features

### 🔐 Authentication

- User Login
- User Registration
- Forgot Password
- Reset Password
- Authentication state managed through Redux
- Protected routes for authenticated users

### 🛍️ Product Module

- Home Page
- Products Listing
- Product Details
- Shopping Cart
- Product-based routing using dynamic product ID

### 👤 User Module

- User Profile
- Shipping Information
- Order Confirmation
- Payment Page
- My Orders
- Single Order Details

### 👨‍💼 Admin Module

- Admin Dashboard
- Product Management
- User Management
- Order Management
- Admin-only protected routes

---

## 🛡️ Route Protection

The application uses a reusable `ProtectedRoute` component.

It protects:

- User account pages
- Shipping
- Checkout
- Payment
- Orders
- Order details
- Admin dashboard
- Admin products
- Admin users
- Admin orders

### User Flow

```text
User
  ↓
Authentication Check
  ↓
Authenticated?
  ├── No → Login
  └── Yes → Account
  ```


 ## Admin Flow
 ```text
User
  ↓
Authentication Check
  ↓
Authenticated?
  ├── No → Login
  └── Yes
       ↓
   Check Role
       ↓
role === "admin"?
  ├── No → Account
  └── Yes → Admin Dashboard
  ```
  ## 🧭 Routing Architecture

The application uses react-router-dom for client-side routing.

### Public Routes
```/
├── /products
├── /product/:id
└── /cart
```

### Authentication Routes
```
/login
/register
/password/forgot
/password/reset/:token
```
### Protected User Routes
```
/account
/shipping
/order/confirm
/process/payment
/orders
/order/:id
```
### Protected Admin Routes
```
/admin/dashboard
/admin/products
/admin/users
/admin/orders
```
## 🗂️ Project Structure
```
src/
│
├── api/
│   └── axios.js
│
├── components/
│   ├── common/
│   │   └── NotFound.jsx
│   │
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   │
│   └── route/
│       └── ProtectedRoute.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── user/
│   │   └── Profile.jsx
│   │
│   ├── cart/
│   │   ├── Shipping.jsx
│   │   ├── ConfirmOrder.jsx
│   │   └── Payment.jsx
│   │
│   ├── order/
│   │   ├── MyOrders.jsx
│   │   └── OrderDetails.jsx
│   │
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminUsers.jsx
│       └── AdminOrders.jsx
│
├── redux/
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── productSlice.js
│       └── cartSlice.js
│
└── App.jsx
```


### 🔒 ProtectedRoute

ProtectedRoute.jsx acts as a frontend route guard.

Its responsibilities are:

`Check whether the user is authenticated.`
`Redirect unauthenticated users to /login.`
`Check the user's role for admin routes.`
`Redirect non-admin users away from admin pages.`
`Render the requested route when authorization succeeds.`

### 🔔 Toast Notifications

react-hot-toast is integrated globally using:

`<Toaster position="top-right" />`

It will be used for displaying:

**Success messages**
**Error messages**
**Login/Register feedback**
**API responses**
**Cart actions**
**Order actions**

###  🧩 Layout Architecture

Common UI components are separated from individual pages.
```
Header
  ↓
Main Content / Routes
  ↓
Footer
```
This prevents duplication and allows common components to remain consistent across the application.


### ❌ 404 Handling

A reusable NotFound component handles invalid URLs.
```
Unknown URL
    ↓
NotFound Component
    ↓
404 - Page Not Found
```