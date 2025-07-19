"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    facultyName: "",
    departmentName: "",
    role: "student",
  })
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const { register } = useAuth()

  useEffect(() => {
    fetchFaculties()
  }, [])

  useEffect(() => {
    if (formData.facultyName && faculties.length > 0) {
      fetchDepartments()
    } else {
      setDepartments([])
      setFormData((prev) => ({ ...prev, departmentName: "" }))
    }
  }, [formData.facultyName, faculties])

  const fetchFaculties = async () => {
    try {
      setDataLoading(true)
      const response = await api.get("/faculty/all")
      // Ensure we always have an array
      const facultyData = Array.isArray(response.data) ? response.data : []
      setFaculties(facultyData)
    } catch (error) {
      console.error("Error fetching faculties:", error)
      setFaculties([])
      if (error.response?.status !== 401) {
        toast.error("Failed to load faculties. Please refresh the page.")
      }
    } finally {
      setDataLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department/all")
      // Ensure we always have an array
      const departmentData = Array.isArray(response.data) ? response.data : []

      // Filter departments by selected faculty
      const selectedFaculty = faculties.find((f) => f.name === formData.facultyName)
      if (selectedFaculty) {
        const filteredDepts = departmentData.filter((dept) => dept.faculty && dept.faculty._id === selectedFaculty._id)
        setDepartments(filteredDepts)
      } else {
        setDepartments([])
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
      setDepartments([])
      if (error.response?.status !== 401) {
        toast.error("Failed to load departments")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await register(formData)

    if (result.success) {
      toast.success("Registration successful!")
    } else {
      toast.error(result.message)
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
      // Clear department when faculty changes
      ...(name === "facultyName" && { departmentName: "" }),
    })
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Register as a new user in the management system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label htmlFor="facultyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty
                </label>
                <select
                  id="facultyName"
                  name="facultyName"
                  required
                  value={formData.facultyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Faculty</option>
                  {Array.isArray(faculties) &&
                    faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                </select>
                {faculties.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    No faculties available. Please{" "}
                    <Link to="/setup" className="underline">
                      create some faculties first
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="departmentName"
                  name="departmentName"
                  required
                  value={formData.departmentName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.facultyName}
                >
                  <option value="">Select Department</option>
                  {Array.isArray(departments) &&
                    departments.map((department) => (
                      <option key={department._id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                </select>
                {formData.facultyName && departments.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">No departments available for this faculty.</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={loading || faculties.length === 0}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
