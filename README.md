# 🎓 Student Course Portal — University Management App

A full-stack web application that enables universities to manage student registration, course enrollment, and faculty-department mapping with ease. Built with **React.js (Vite)** on the frontend, **Node.js + Express** on the backend, and **MongoDB** for persistent storage.

---

## 🌐 Live Demo

🔗 [View Live App](https://schoolmanagement-1-frontend.onrender.com)

---

## 📦 Tech Stack

### 🔹 Frontend
- React.js (Vite)
- Tailwind CSS (UI Framework)
- Axios (API calls)
- React Router (Routing)
- State Management —useContext

### 🔹 Backend
- Express.js (REST API)
- MongoDB + Mongoose (Database)
- dotenv (Environment config)
- bcrypt.js (Password hashing)
- JSON Web Tokens (JWT Auth)
- CORS, (Security & headers)

---

## 📁 Folder Structure
├── client/ # React frontend (Vite)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── utils/
│ │ └── App.jsx
│ └── index.html
├── server/ # Express backend
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── server.js
└── README.md



---

## ✅ Features

### 👤 Authentication
- JWT-based login for **Student** and **Admin**
- Role-based access

### 📚 Admin Dashboard
- Create, update, delete courses
- Register faculties and departments
- View all enrolled students

### 👨‍🎓 Student Dashboard
- View available courses
- Enroll in selected courses
- View enrolled courses

### 🔐 Protected Routes
- React `ProtectedRoute` component
- Token validation logic

### 📊 Utility Features
- Auto-generate student registration numbers
- Validation  manual checks
- Responsive design with TailwindCSS
- Error handling 

---

## 🧪 Setup Instructions

### 🚀 Clone the repo

```bash
git clone https://github.com/Chukwunonso10/SchoolManagement.git
cd student-course-portal

PORT=3000
MONGO_URI_PRODUCTION=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret

cd server
pnpm install
pnpm start

cd client
pnpm install
pnpm run dev

###  API Endpoints
Auth
POST /api/auth/register

POST /api/auth/login

POST /api/auth/fac

POST /api/auth/dept

Students
GET /api/students/all
GET /api/students/me/:regNo

Courses
GET /api/course
POST /api/course
PUT /api/course/:code
DELETE /api/course/:code

POST /api/course/create (Enroll students)
GET /api/course/enrollment

📸 Screenshots
![App Screenshot](C:\Users\NCC\Pictures\Screenshots.png)

(Include dashboard images, login page, etc.)

🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss.