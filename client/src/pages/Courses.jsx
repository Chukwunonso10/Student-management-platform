"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    unit: "",
    departmentName: "",
    semester: "",
  })
  const [enrollData, setEnrollData] = useState({
    regNo: user?.regNo || "",
    code: "",
  })

  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get("/course/all")
      setCourses(response.data.courses || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch courses")
      }
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department/all")
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Creating course with data:", formData)
      const response = await api.post("/course/", formData)
      console.log("Course created:", response.data)
      toast.success("Course created successfully!")
      setShowCreateForm(false)
      setFormData({
        title: "",
        code: "",
        unit: "",
        departmentName: "",
        semester: "",
      })
      fetchCourses()
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Failed to create course")
    }

    setLoading(false)
  }

  const handleEnrollCourse = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/course/enroll", enrollData)
      toast.success("Enrolled successfully!")
      setShowEnrollForm(false)
      setEnrollData({
        regNo: user?.regNo || "",
        code: "",
      })
      fetchCourses()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll")
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEnrollChange = (e) => {
    setEnrollData({
      ...enrollData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage and view courses</p>
        </div>
        <div className="flex space-x-2">
          {user?.role === "student" && <Button onClick={() => setShowEnrollForm(true)}>Enroll in Course</Button>}
          {(user?.role === "Admin" || user?.role === "Lecturer") && (
            <Button onClick={() => setShowCreateForm(true)}>Create Course</Button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Add a new course to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <Input
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <Input
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter course code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                  <Input
                    name="unit"
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Enter units"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    name="semester"
                    required
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Semester</option>
                    <option value="Ist Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="departmentName"
                    required
                    value={formData.departmentName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Course"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showEnrollForm && (
        <Card>
          <CardHeader>
            <CardTitle>Enroll in Course</CardTitle>
            <CardDescription>Register for a new course</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnrollCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <Input
                    name="regNo"
                    required
                    value={enrollData.regNo}
                    onChange={handleEnrollChange}
                    placeholder="Your registration number"
                    disabled={user?.role === "student"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <Input
                    name="code"
                    required
                    value={enrollData.code}
                    onChange={handleEnrollChange}
                    placeholder="Enter course code"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enrolling..." : "Enroll"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEnrollForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Units:</span>
                  <span className="font-medium">{course.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Semester:</span>
                  <span className="font-medium">{course.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Enrolled:</span>
                  <span className="font-medium">{course.enrolledStudents?.length || 0}</span>
                </div>
                {course.department && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="font-medium">{course.department.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No courses available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
