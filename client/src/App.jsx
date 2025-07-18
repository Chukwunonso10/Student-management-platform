import SignUp from "./pages/SignUp"
import Login from "@/pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import StudentDashboard from "./pages/StudentDashBoard"
import ThemeToggle from "./components/themeToggle"
import Navbar from "./components/Navbar"


export default function App() {
  return (
    <div>
      <ThemeToggle />
      <Navbar />
      <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}
