# 📁 File Management Application

A backend focused file management application with authentication, folder management, file uploads, and file sharing as well as basic frontend.

---

## 🗂️ Project Structure

```
mono-repo/
├── backend/          # Express.js + TypeScript API
└── frontend/         # Next.js frontend
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js, TypeScript     |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Validation| Zod                                 |
| Frontend  | Next.js, TypeScript                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/filemanager
JWT_SECRET=your_jwt_secret_key_here
```

Start the development server:

```bash
npm start
```

The backend runs on `http://localhost:3000`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3001`

---

## 📁 Backend Structure

```
backend/
├── controllers/        # Request handling logic
├── middlewares/        # Auth & validation middleware
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── types/              # TypeScript type extensions
├── utils/              # Response formatters & helpers
├── validations/        # Zod validation schemas
├── uploads/            # Uploaded files (local storage)
├── app.ts              # Express app setup
└── server.ts           # Server entry point & DB connection
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint         | Description       | Protected |
|--------|------------------|-------------------|-----------|
| POST   | `/api/auth/signup` | Register new user | ❌        |
| POST   | `/api/auth/login`  | Login user        | ❌        |

### Folder Routes — `/api/folders`

| Method | Endpoint            | Description        | Protected |
|--------|---------------------|--------------------|-----------|
| POST   | `/api/folders`      | Create folder      | ✅        |
| GET    | `/api/folders`      | View own folders   | ✅        |
| DELETE | `/api/folders/:id`  | Delete folder      | ✅        |

### File Routes — `/api/files`

| Method | Endpoint            | Description        | Protected |
|--------|---------------------|--------------------|-----------|
| POST   | `/api/files/upload` | Upload file        | ✅        |
| GET    | `/api/files`        | View own files     | ✅        |
| DELETE | `/api/files/:id`    | Delete file        | ✅        |

### File Sharing — `/api/files`

| Method | Endpoint                  | Description              | Protected |
|--------|---------------------------|--------------------------|-----------|
| POST   | `/api/files/:id/share`    | Generate shareable link  | ✅        |
| GET    | `/api/files/share/:token` | Access shared file       | ❌        |

---

## 🔐 Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned on successful signup and login.

---

## 📦 Response Format

### Success
```json
{
  "success": true,
  "message": "Request processed successfully",
  "data": { }
}
```

### Error
```json
{
  "success": false,
  "message": "Error processing request",
  "error": "Detailed error message"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation errors",
  "error": "Invalid request payload",
  "validationErrors": [
    { "path": "email", "message": "Invalid email address" }
  ]
}
```

---

## ✅ Features

- [x] User Signup & Login
- [x] Password Hashing (bcryptjs)
- [x] JWT Authentication
- [x] Protected Routes
- [x] Folder Management (Create, View, Delete)
- [x] File Upload & Management
- [x] File Sharing via Link

---

## 🌿 Git Branches

| Branch                  | Feature                  |
|-------------------------|--------------------------|
| `main`                  | Production-ready code    |
| `feature/authentication`| Auth implementation      |
| `feature/folder-management` | Folder CRUD          |
| `feature/file-management`   | File upload & storage|
| `feature/file-sharing`      | Shareable links      |
