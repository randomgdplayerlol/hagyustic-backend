# HaGyustic eCommerce Backend

This is the backend server for the HaGyustic eCommerce web application. It is built using Node.js, Express.js, and MongoDB, and supports a complete eCommerce workflow including authentication, product management, cart/checkout, and admin dashboards.

## Features

- User registration, login, and social login (Google, Facebook via Firebase)
- Password reset with email integration
- Admin-protected routes for managing:
  - Products (CRUD, image uploads via Cloudinary)
  - Carousel banners
  - Orders (status updates, bulk actions)
  - Users
- Order creation and analytics
- Stripe and PayPal integration for payments
- Fully RESTful API with secure JWT-based authentication
- Multer for image upload handling
- MongoDB with Mongoose ODM

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT + Firebase for social login
- **Image Upload:** Cloudinary + Multer
- **Payments:** Stripe & PayPal integration
- **Email:** Nodemailer (Gmail SMTP)
- **Environment:** dotenv

## API Endpoints Overview

### Auth Routes
```

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/social-login
GET    /api/auth/me
POST   /api/auth/password-reset-request
POST   /api/auth/password-reset

```

### User Routes
```

GET    /api/user
PUT    /api/user
PUT    /api/user/password
GET    /api/user/has-placed-order
GET    /api/user/users           (Admin only)

```

### Product Routes
```

GET    /api/products
GET    /api/products/\:id
POST   /api/products              (Admin only)
POST   /api/products/\:id/images  (Admin only)
PUT    /api/products/\:id         (Admin only)
DELETE /api/products/\:id         (Admin only)
DELETE /api/products/\:id/images  (Admin only)

```

### Order Routes
```

POST   /api/orders
GET    /api/orders               (User's orders)
GET    /api/orders/\:id
GET    /api/orders/all           (Admin only)
GET    /api/orders/analytics     (Admin only)
PUT    /api/orders/\:id/status    (Admin only)
PUT    /api/orders/bulk-update   (Admin only)

```

### Carousel Routes
```

GET    /api/carousel
POST   /api/carousel              (Admin only)
PUT    /api/carousel/\:id         (Admin only)
DELETE /api/carousel/\:id         (Admin only)

```

### Category Routes
```

GET    /api/categories

```

### Payment Routes
```

POST   /api/payment/create-checkout-session   (Stripe)
POST   /api/payment/paypal-capture            (PayPal)

````

## Environment Variables

Create a `.env` file in the root with the following variables:

```env
PORT=5000
MONGODB_URL=your_mongo_connection_string
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
````

## Folder Structure

```text
/controllers       # Route handler logic
/models            # Mongoose schemas
/routes            # All API route definitions
/middleware        # Auth and multer middleware
/utils             # Custom utilities like error handler
/config            # Cloudinary, Firebase, DB config
```

## Setup Instructions

```bash
git clone https://github.com/your-username/hagyustic-backend.git
cd hagyustic-backend
npm install
npm start
```

## Deployment

You can deploy this backend to platforms like:

* [Render](https://render.com/)

## Security Notes

* All sensitive keys are stored in `.env` and excluded via `.gitignore`
* Admin routes are protected using role-based JWT middleware
* Passwords are hashed using bcrypt
* Cloudinary and Firebase services are initialized with environment config

