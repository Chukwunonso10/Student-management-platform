"use client"

import { useState, useEffect } from "react"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Setup() {
  const [facultyData, setFacultyData] = useState({
    name: "",
    code: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  })
  const [departmentData, setDepartmentData] = useState({
    name: "",
    code: "",
    description: "",
    faculty: "",
  })
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    faculties: 0,
    departments: 0,
    users: 0,
    isEmpty: true,
    dbConnected: false,
  })
  const [statusLoading, setStatusLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    try {
      setStatusLoading(true)
      console.log("Checking system status...")

      const response = await api.get("/setup/status")
      console.log("System status response:", response.data)

      setSystemStatus(response.data.data)
      setDebugInfo(response.data.debug)
    } catch (error) {
      console.error("Error checking system status:", error)
      setDebugInfo({
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })

      // Fallback to individual API calls
      try {
        const [facultiesRes, departmentsRes, usersRes] = await Promise.allSettled([
          api.get("/faculty/all"),
          api.get("/department/all"),
          api.get("/auth/all"),
        ])

        const faculties = facultiesRes.status === "fulfilled" ? facultiesRes.value.data?.length || 0 : 0
        const departments = departmentsRes.status === "fulfilled" ? departmentsRes.value.data?.length || 0 : 0
        const users = usersRes.status === "fulfilled" ? usersRes.value.data?.data?.length || 0 : 0

        setSystemStatus({
          faculties,
          departments,
          users,
          isEmpty: faculties === 0 && departments === 0 && users === 0,
          dbConnected: false,
        })
      } catch (fallbackError) {
        console.error("Fallback status check failed:", fallbackError)
        toast.error("Unable to check system status")
      }
    } finally {
      setStatusLoading(false)
    }
  }

  const testDatabaseConnection = async () => {
    try {
      setLoading(true)
      console.log("Testing database connection...")

      const response = await api.get("/setup/test-db")
      console.log("Database test response:", response.data)

      if (response.data.status === "success") {
        toast.success("Database connection is working!")
      } else {
        toast.error("Database connection failed")
      }
    } catch (error) {
      console.error("Database test failed:", error)
      toast.error("Database connection test failed: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const initializeSystem = async () => {
    setLoading(true)
    try {
      console.log("Initializing system...")

      const response = await api.post("/setup/initialize")
      console.log("Initialize response:", response.data)

      if (response.data.status === "success") {
        toast.success("System initialized successfully!")
        toast.success("Default admin created: admin@university.com / admin123")

        // Refresh status
        await checkSystemStatus()

        // Show success message with next steps
        setTimeout(() => {
          toast.success("You can now register users or login with the admin account!")
        }, 2000)
      } else {
        toast.error("Initialization failed: " + response.data.message)
      }
    } catch (error) {
      console.error("Error initializing system:", error)

      const errorMessage = error.response?.data?.message || error.message
      const errorDetails = error.response?.data?.error || ""

      if (error.response?.status === 400) {
        toast.error("System already initialized")
      } else if (errorMessage.includes("MONGO_URI")) {
        toast.error("Database connection not configured. Check environment variables.")
      } else if (errorMessage.includes("Database connection failed")) {
        toast.error("Cannot connect to database. Check MongoDB Atlas configuration.")
      } else {
        toast.error("Initialization failed: " + errorMessage)
        if (errorDetails) {
          console.error("Error details:", errorDetails)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const resetSystem = async () => {
    if (!confirm("⚠️ WARNING: This will delete ALL data! Are you sure?")) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post(
        "/setup/reset",
        {},
        {
          headers: {
            "x-reset-confirm": "yes-delete-all-data",
          },
        },
      )

      if (response.data.status === "success") {
        toast.success("System reset completed")
        await checkSystemStatus()
      }
    } catch (error) {
      console.error("Reset failed:", error)
      toast.error("Reset failed: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFaculty = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating faculty:", facultyData)
      const response = await api.post("/faculty/", facultyData)
      console.log("Faculty created:", response.data)
      toast.success("Faculty created successfully!")
      setFacultyData({
        name: "",
        code: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
      })
      checkSystemStatus()
    } catch (error) {
      console.error("Error creating faculty:", error)
      toast.error(error.response?.data?.message || "Failed to create faculty")
    }

    setLoading(false)
  }

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating department:", departmentData)
      const response = await api.post("/department/", departmentData)
      console.log("Department created:", response.data)
      toast.success("Department created successfully!")
      setDepartmentData({
        name: "",
        code: "",
        description: "",
        faculty: "",
      })
      checkSystemStatus()
    } catch (error) {
      console.error("Error creating department:", error)
      toast.error(error.response?.data?.message || "Failed to create department")
    }

    setLoading(false)
  }

  const handleFacultyChange = (e) => {
    setFacultyData({
      ...facultyData,
      [e.target.name]: e.target.value,
    })
  }

  const handleDepartmentChange = (e) => {
    setDepartmentData({
      ...departmentData,
      [e.target.name]: e.target.value,
    })
  }

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">System Setup</h1>
          <p className="text-gray-600">Initialize your Student Management System</p>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current state of your database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{systemStatus.faculties}</div>
                <div className="text-sm text-blue-800">Faculties</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{systemStatus.departments}</div>
                <div className="text-sm text-green-800">Departments</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{systemStatus.users}</div>
                <div className="text-sm text-purple-800">Users</div>
              </div>
            </div>

            {/* Database Connection Status */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Connection:</span>
                <span className={`text-sm font-bold ${systemStatus.dbConnected ? "text-green-600" : "text-red-600"}`}>
                  {systemStatus.dbConnected ? "✅ Connected" : "❌ Disconnected"}
                </span>
              </div>
            </div>

            {systemStatus.isEmpty && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>🚨 Empty Database Detected:</strong> Your production database is empty. Use the quick setup
                  below to get started.
                </p>
              </div>
            )}

            {!systemStatus.isEmpty && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>✅ System Ready:</strong> Your database has been initialized. You can now register users or
                  login.
                </p>
              </div>
            )}

            {/* Debug Information */}
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>MongoDB URI: {debugInfo.mongoUri || "Not configured"}</div>
                  <div>JWT Secret: {debugInfo.jwtSign || "Not configured"}</div>
                  <div>Environment: {debugInfo.nodeEnv || "Not set"}</div>
                  <div>Port: {debugInfo.port || "Not set"}</div>
                  {debugInfo.error && <div className="text-red-600">Error: {debugInfo.error}</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-x-2">
            <Button onClick={testDatabaseConnection} disabled={loading} variant="outline" size="sm">
              {loading ? "Testing..." : "🔍 Test Database Connection"}
            </Button>
            <Button variant="outline" onClick={checkSystemStatus} disabled={loading} size="sm">
              🔄 Refresh Status
            </Button>
          </div>

          <div>
            <Button onClick={initializeSystem} disabled={loading || !systemStatus.isEmpty} size="lg" className="mb-4">
              {loading ? "Initializing..." : "🚀 Quick Setup - Initialize System"}
            </Button>
            <p className="text-sm text-gray-500">
              This will create 4 faculties, 9 departments, and a default admin user
            </p>
          </div>

          {!systemStatus.isEmpty && (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => (window.location.href = "/register")} size="sm">
                👤 Register User
              </Button>
              <Button onClick={() => (window.location.href = "/login")} size="sm">
                🚀 Go to Login
              </Button>
              {process.env.NODE_ENV !== "production" && (
                <Button variant="destructive" onClick={resetSystem} disabled={loading} size="sm">
                  🗑️ Reset System
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Manual Creation Forms - Only show if system is not empty */}
        {!systemStatus.isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Create Faculty Manually</CardTitle>
                <CardDescription>Add a new faculty to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateFaculty} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                    <Input
                      name="name"
                      required
                      value={facultyData.name}
                      onChange={handleFacultyChange}
                      placeholder="e.g., Faculty of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Code</label>
                    <Input
                      name="code"
                      required
                      value={facultyData.code}
                      onChange={handleFacultyChange}
                      placeholder="e.g., SCI"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <Input
                      name="contactEmail"
                      type="email"
                      required
                      value={facultyData.contactEmail}
                      onChange={handleFacultyChange}
                      placeholder="faculty@university.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <Input
                      name="contactPhone"
                      required
                      value={facultyData.contactPhone}
                      onChange={handleFacultyChange}
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={facultyData.description}
                      onChange={handleFacultyChange}
                      placeholder="Faculty description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating..." : "Create Faculty"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Department Manually</CardTitle>
                <CardDescription>Add a new department to a faculty</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDepartment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <Input
                      name="name"
                      required
                      value={departmentData.name}
                      onChange={handleDepartmentChange}
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                    <Input
                      name="code"
                      required
                      value={departmentData.code}
                      onChange={handleDepartmentChange}
                      placeholder="e.g., CSC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                    <Input
                      name="faculty"
                      required
                      value={departmentData.faculty}
                      onChange={handleDepartmentChange}
                      placeholder="e.g., Faculty of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={departmentData.description}
                      onChange={handleDepartmentChange}
                      placeholder="Department description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <Button type="submit" disabled={loading || systemStatus.faculties === 0} className="w-full">
                    {loading ? "Creating..." : "Create Department"}
                  </Button>
                  {systemStatus.faculties === 0 && (
                    <p className="text-sm text-amber-600">Create at least one faculty first</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What to do after setting up faculties and departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.faculties > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.faculties > 0 ? "✓" : "1"}
                </div>
                <span className={systemStatus.faculties > 0 ? "text-green-800" : "text-gray-600"}>
                  Create Faculties ({systemStatus.faculties} created)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.departments > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.departments > 0 ? "✓" : "2"}
                </div>
                <span className={systemStatus.departments > 0 ? "text-green-800" : "text-gray-600"}>
                  Create Departments ({systemStatus.departments} created)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    systemStatus.users > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {systemStatus.users > 0 ? "✓" : "3"}
                </div>
                <span className={systemStatus.users > 0 ? "text-green-800" : "text-gray-600"}>
                  Register Admin User ({systemStatus.users} users)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <span className="text-gray-600">Start using the system</span>
              </div>
            </div>

            {systemStatus.users > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🎉 System Ready!</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Your system is initialized. You can login with the default admin account:
                </p>
                <div className="bg-blue-100 p-3 rounded font-mono text-sm">
                  <div>📧 Email: admin@university.com</div>
                  <div>🔑 Password: admin123</div>
                </div>
                <p className="text-blue-700 text-xs mt-2">⚠️ Please change the admin password after first login!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
