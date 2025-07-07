import { useNavigate } from "react-router-dom"

export default function ProtectedRoute({children}) {
    navigate = useNavigate()
    
    const token = localStorage.getItem('token')
    return token ? children : navigate("/login")
}