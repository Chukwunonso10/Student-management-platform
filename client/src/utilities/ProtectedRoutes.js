

export default function ProtectedRoute({children}) {
    
    const token = localStorage.getItem('token')
    return token ? children : window.location.href="/login"
}