import SignUp from "./pages/SignUp"
import Login from "@/pages/Login"
import { Routes, Route } from "react-router-dom"
import { BrowserRouter } from 'react-router-dom'
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./utilities/ProtectedRoutes"
import ThemeToggle from "./components/themeToggle"


export default function App() {
  return (
    <div>
      <ThemeToggle />
      <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
                          <ProtectedRoute>  
                            <Dashboard /> 
                          </ProtectedRoute>
          } />
       
      </Routes>
      </BrowserRouter>
    </div>
  )
}
