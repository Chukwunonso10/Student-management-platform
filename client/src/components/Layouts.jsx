import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", roles: ["student", "Admin", "Lecturer"] },
    { name: "Courses", href: "/courses", roles: ["student", "Admin", "Lecturer"] },
    { name: "Students", href: "/students", roles: ["Admin", "Lecturer"] },
    { name: "Lecturers", href: "/lecturers", roles: ["Admin"] },
    { name: "Faculties", href: "/faculties", roles: ["Admin"] },
    { name: "Departments", href: "/departments", roles: ["Admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || "student"))

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Student Management System</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user?.role}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
