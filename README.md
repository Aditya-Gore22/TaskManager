# TaskManager

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Aditya-Gore22/TaskManager)

A simple and lightweight Task Management API built with Node.js and Express. This application allows users to register, log in, and manage their personal tasks through a set of RESTful endpoints. It uses JSON files for data persistence and JWT for securing routes.

## Features

-   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
-   **CRUD Operations for Tasks**: Full support for Creating, Reading, Updating, and Deleting tasks.
-   **User-Specific Tasks**: Tasks are tied to individual users, ensuring privacy and data separation.
-   **Middleware Integration**: Includes middleware for request logging and route authorization.
-   **File-Based Database**: Uses simple JSON files for storing user and task data, making it easy to set up and inspect.

## Project Structure

The repository is organized into several directories to maintain a clean and scalable structure:

```
├── server.js                   # Main application entry point
├── controllers/
│   ├── authController.js       # Logic for user authentication (register, login)
│   └── taskController.js       # Logic for task CRUD operations
├── data/
│   ├── task.json               # Stores task data
│   └── user.json               # Stores user data
├── middleware/
│   ├── authorizationMiddleware.js # JWT verification for protected routes
│   └── logMiddleware.js        # Request logging using Winston
└── routes/
    ├── authRoute.js            # Defines authentication API endpoints
    └── taskRoutes.js           # Defines task management API endpoints
```

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/aditya-gore22/taskmanager.git
    cd taskmanager
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add the following environment variables.
    ```env
    PORT=3000
    JWT_KEY=your_super_secret_jwt_key
    ```
    Replace `your_super_secret_jwt_key` with a long, random, and secure string.

## Running the Application

To start the server, run the following command from the root directory:

```sh
node server.js
```

The server will start and listen on the port specified in your `.env` file (e.g., `http://localhost:3000`).

## API Endpoints

### Authentication Routes

All authentication routes are prefixed with `/auth`.

| Method | Endpoint         | Description                                                        | Request Body                                         |
| :----- | :--------------- | :----------------------------------------------------------------- | :--------------------------------------------------- |
| `POST` | `/register`      | Registers a new user.                                              | `{ "name", "userName", "email", "pass" }`            |
| `POST` | `/login`         | Logs in an existing user and returns a JWT.                        | `{ "email", "pass" }`                                |
| `POST` | `/logout`        | Clears the authentication cookie.                                  | _None_                                               |

### Task Routes

These routes are protected and require a valid JWT to be sent in the `Authorization` header as a Bearer token.

| Method   | Endpoint          | Description                                    | Request Body                                                              |
| :------- | :---------------- | :--------------------------------------------- | :------------------------------------------------------------------------ |
| `GET`    | `/displayTask`    | Fetches all tasks for the logged-in user.      | _None_                                                                    |
| `POST`   | `/createTask`     | Creates a new task for the logged-in user.     | `{ "title", "description", "status", "priority", "dueDate" }`             |
| `GET`    | `/displayTask/:id`| Fetches a specific task by its ID.             | _None_                                                                    |
| `PUT`    | `/updateTask/:id` | Updates a task's status and/or priority by ID. | `{ "status" (optional), "priority" (optional) }`                          |
| `DELETE` | `/deleteTask/:id` | Deletes a task by its ID.                      | _None_                                                                    |

**Example cURL request for a protected route:**

```sh
curl -X GET http://localhost:3000/displayTask \
-H "Authorization: Bearer <your_jwt_token>"
