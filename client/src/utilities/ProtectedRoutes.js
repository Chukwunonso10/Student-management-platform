import { useNavigate } from "react-router-dom"
import React from 'react'

export default function ProtectedRoute({children}) {
    const navigate = useNavigate()
    
    const token = localStorage.getItem('token')
    return token ? children : navigate("/login")
}