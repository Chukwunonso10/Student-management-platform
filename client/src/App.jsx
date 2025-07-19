import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Courses from "./pages/Courses"
import Students from "./pages/Students"
import Lecturers from "./pages/Lecturers"
import Faculties from "./pages/Faculties"
import Departments from "./pages/Departments"
import Layout from "./components/Layouts"
import { Toaster } from "sonner"
import Setup from "./pages/Setup"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function App() {
  return (
    
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50" >
          <Routes>
            <Route path="/setup" element={<Setup />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="students" element={<Students />} />
              <Route path="lecturers" element={<Lecturers />} />
              <Route path="faculties" element={<Faculties />} />
              <Route path="departments" element={<Departments />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
