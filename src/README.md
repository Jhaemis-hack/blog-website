# OSF_BlogAPI Documentation

This project is a RESTful API built using Node.js, Express.js, and MongoDB. It offers endpoints for user and admin functionalities, including user authentication, content management, and user account control.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
   - [User Routes](#user-routes)
   - [Admin Routes](#admin-routes)
6. [Authentication](#authentication)
7. [Middleware](#middleware)
8. [Error Handling](#error-handling)
9. [How to Run Locally](#how-to-run-locally)
10. [Future Enhancements](#future-enhancements)

---

## Introduction

This API provides a robust backend system for managing blog-related content and user accounts. Users can view various types of content, sign up, and log in, while admins have additional privileges, such as managing users and posting blogs.

---

## Getting Started

To use this API, clone the repository, set up the environment variables, and run the server locally. See [How to Run Locally](#how-to-run-locally) for detailed instructions.

---

## Project Structure

```
project-root/
├── app.js                    # Main entry point for the application
├── server/
│   ├── config/
│   │   └── server.js         # MongoDB connection setup
│   ├── routes/
│   │   ├── userRoute.js      # User-related routes
│   │   └── adminRoute.js     # Admin-related routes
│   ├── controllers/
│   │   ├── userController.js # Logic for user operations
│   │   └── adminController.js# Logic for admin operations
│   └── Protection/
│       └── Auth-Config/
│           └── Auth.js       # JWT configuration and middleware
└── .env                      # Environment variables
```

---

## Environment Variables

The following environment variables are required for the application:

| Key         | Description                     |
|-------------|---------------------------------|
| `PORT`      | The port where the server runs  |
| `DB_URI`    | MongoDB connection string       |
| `JWT_SECRET`| Secret for JWT authentication   |

---

## API Endpoints

### User Routes

| Method | Endpoint                | Description                          | Authentication |
|--------|--------------------------|--------------------------------------|----------------|
| `GET`  | `/`                      | Landing page                         | No             |
| `GET`  | `/Finance`               | Get finance-related content          | No             |
| `GET`  | `/Travel`                | Get travel-related content           | No             |
| `GET`  | `/Lifestyle`             | Get lifestyle-related content        | No             |
| `GET`  | `/Entertainment`         | Get entertainment-related content    | No             |
| `GET`  | `/Refreshment`           | Get refreshment-related content      | No             |
| `GET`  | `/Science`               | Get science-related content          | No             |
| `GET`  | `/Environment`           | Get environment-related content      | No             |
| `GET`  | `/PersonalFinance`       | Get personal finance content         | No             |
| `GET`  | `/blog/:id`              | View a specific blog by ID           | No             |
| `POST` | `/blog/:id/delete`       | Delete a blog by ID                  | Yes            |
| `POST` | `/signup`                | Sign up as a new user                | No             |
| `POST` | `/login`                 | Log in as a user                     | No             |

### Admin Routes

| Method | Endpoint           | Description                          | Authentication |
|--------|---------------------|--------------------------------------|----------------|
| `GET`  | `/getall/users`     | Retrieve all users                   | Yes            |
| `GET`  | `/user/:email`      | Retrieve a user by email             | Yes            |
| `POST` | `/user/disabled`    | Disable a user account               | Yes            |
| `POST` | `/`                 | Post a new blog                      | Yes            |

---

## Authentication

### JWT (JSON Web Tokens)

The API uses JWT for securing endpoints. The following middleware is used:

- **`jwtCheck`**: Validates the presence of a valid JWT in the request headers.
- **`jwtAuth`**: Authorizes access to admin-protected routes.

To secure a route, include the middleware:

```javascript
router.get('/protected', jwtCheck(), (req, res) => {
    res.json({ message: "This is a protected route." });
});
```

---

## Middleware

- **Morgan**: Logs HTTP requests for debugging purposes.
- **Body Parser**: Parses JSON and URL-encoded payloads.
- **Multer**: Handles file uploads for blog images.
- **JWT Middleware**: Secures protected endpoints.

---

## Error Handling

Global error handling is implemented for authentication errors. If a request contains an invalid or missing JWT, the server responds with:

```json
{
    "message": "Invalid or missing token"
}
```

---

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file with the required environment variables.

4. Start the server:
   ```bash
   npm start
   ```

5. Access the API at:
   ```
   http://localhost:<PORT>
   ```

---

## Future Enhancements

- Implement role-based access control.
- Add comprehensive validation for request payloads.
- Introduce detailed logging for production environments.
- Expand test coverage with unit and integration tests.

---

