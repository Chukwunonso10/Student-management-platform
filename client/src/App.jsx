import SignUp from "./pages/SignUp"
import Login from "@/pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/AdminDashboard"
import ThemeToggle from "./components/themeToggle"


export default function App() {
  return (
    <div>
      <ThemeToggle />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}
