"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalLecturers: 0,
    totalFaculties: 0,
  })
  const [recentCourses, setRecentCourses] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, coursesRes, lecturersRes, facultiesRes] = await Promise.all([
        api.get("/auth/all").catch(() => ({ data: { data: [] } })),
        api.get("/course/all").catch(() => ({ data: { courses: [] } })),
        api.get("/lecturer/").catch(() => ({ data: { lecturers: [] } })),
        api.get("/faculty/all").catch(() => ({ data: [] })),
      ])

      setStats({
        totalStudents: studentsRes.data.data?.length || 0,
        totalCourses: coursesRes.data.courses?.length || 0,
        totalLecturers: lecturersRes.data.lecturers?.length || 0,
        totalFaculties: facultiesRes.data.length || 0,
      })

      setRecentCourses(coursesRes.data.courses?.slice(0, 5) || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case "view-courses":
        navigate("/courses")
        break
      case "enroll-course":
        navigate("/courses")
        // You could add a URL parameter to auto-open the enroll form
        break
      case "manage-students":
        navigate("/students")
        break
      case "create-course":
        navigate("/courses")
        // You could add a URL parameter to auto-open the create form
        break
      case "my-courses":
        navigate("/courses")
        break
      case "student-list":
        navigate("/students")
        break
      case "manage-lecturers":
        navigate("/lecturers")
        break
      case "manage-faculties":
        navigate("/faculties")
        break
      case "manage-departments":
        navigate("/departments")
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getWelcomeMessage()}, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Welcome to your {user?.role} dashboard</p>
      </div>

      {user?.role === "Admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/students")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">Click to view all students</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/courses")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-gray-500 mt-1">Click to manage courses</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/lecturers")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Lecturers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLecturers}</div>
              <p className="text-xs text-gray-500 mt-1">Click to manage lecturers</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/faculties")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Faculties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFaculties}</div>
              <p className="text-xs text-gray-500 mt-1">Click to manage faculties</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Latest courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCourses.length > 0 ? (
              <div className="space-y-3">
                {recentCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => navigate("/courses")}
                  >
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-gray-600">
                        {course.code} • {course.unit} units
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{course.semester}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/courses")} className="w-full">
                    View All Courses
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No courses available</p>
                {(user?.role === "Admin" || user?.role === "Lecturer") && (
                  <Button onClick={() => navigate("/courses")}>Create First Course</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === "student" && (
                <>
                  <div
                    className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleQuickAction("view-courses")}
                  >
                    <h4 className="font-medium text-blue-900">View My Courses</h4>
                    <p className="text-sm text-blue-700">Check your enrolled courses</p>
                  </div>
                  <div
                    className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleQuickAction("enroll-course")}
                  >
                    <h4 className="font-medium text-green-900">Enroll in Course</h4>
                    <p className="text-sm text-green-700">Register for new courses</p>
                  </div>
                </>
              )}

              {user?.role === "Admin" && (
                <>
                  <div
                    className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleQuickAction("manage-students")}
                  >
                    <h4 className="font-medium text-purple-900">Manage Students</h4>
                    <p className="text-sm text-purple-700">View and manage student records</p>
                  </div>
                  <div
                    className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => handleQuickAction("create-course")}
                  >
                    <h4 className="font-medium text-orange-900">Create Course</h4>
                    <p className="text-sm text-orange-700">Add new courses to the system</p>
                  </div>
                  <div
                    className="p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors"
                    onClick={() => handleQuickAction("manage-lecturers")}
                  >
                    <h4 className="font-medium text-pink-900">Manage Lecturers</h4>
                    <p className="text-sm text-pink-700">Add and manage lecturer records</p>
                  </div>
                  <div
                    className="p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={() => handleQuickAction("manage-faculties")}
                  >
                    <h4 className="font-medium text-indigo-900">Manage Faculties</h4>
                    <p className="text-sm text-indigo-700">Create and manage faculties</p>
                  </div>
                </>
              )}

              {user?.role === "Lecturer" && (
                <>
                  <div
                    className="p-3 bg-indigo-50 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={() => handleQuickAction("my-courses")}
                  >
                    <h4 className="font-medium text-indigo-900">My Courses</h4>
                    <p className="text-sm text-indigo-700">View courses you're teaching</p>
                  </div>
                  <div
                    className="p-3 bg-teal-50 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors"
                    onClick={() => handleQuickAction("student-list")}
                  >
                    <h4 className="font-medium text-teal-900">Student List</h4>
                    <p className="text-sm text-teal-700">View enrolled students</p>
                  </div>
                  <div
                    className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleQuickAction("create-course")}
                  >
                    <h4 className="font-medium text-green-900">Create Course</h4>
                    <p className="text-sm text-green-700">Add new courses to the system</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.regNo && (
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Number</label>
                <p className="font-mono text-lg">{user.regNo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p>{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
