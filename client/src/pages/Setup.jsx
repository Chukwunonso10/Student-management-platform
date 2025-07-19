"use client"

import { useState } from "react"
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

  const createSampleData = async () => {
    setLoading(true)
    try {
      console.log("Starting to create sample data...")

      // Create sample faculties
      const faculties = [
        {
          name: "Faculty of Science",
          code: "SCI",
          description: "Faculty of Science and Technology",
          contactEmail: "science@university.com",
          contactPhone: "+1234567890",
        },
        {
          name: "Faculty of Arts",
          code: "ART",
          description: "Faculty of Arts and Humanities",
          contactEmail: "arts@university.com",
          contactPhone: "+1234567891",
        },
        {
          name: "Faculty of Engineering",
          code: "ENG",
          description: "Faculty of Engineering",
          contactEmail: "engineering@university.com",
          contactPhone: "+1234567892",
        },
      ]

      console.log("Creating faculties...")
      for (const faculty of faculties) {
        try {
          const response = await api.post("/faculty/", faculty)
          console.log(`Faculty ${faculty.name} created:`, response.data)
        } catch (error) {
          console.log(`Faculty ${faculty.name} error:`, error.response?.data)
        }
      }

      // Wait a bit before creating departments
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create sample departments
      const departments = [
        {
          name: "Computer Science",
          code: "CSC",
          description: "Department of Computer Science",
          faculty: "Faculty of Science",
        },
        {
          name: "Mathematics",
          code: "MTH",
          description: "Department of Mathematics",
          faculty: "Faculty of Science",
        },
        {
          name: "English Literature",
          code: "ENG",
          description: "Department of English Literature",
          faculty: "Faculty of Arts",
        },
        {
          name: "History",
          code: "HIS",
          description: "Department of History",
          faculty: "Faculty of Arts",
        },
        {
          name: "Civil Engineering",
          code: "CVE",
          description: "Department of Civil Engineering",
          faculty: "Faculty of Engineering",
        },
        {
          name: "Electrical Engineering",
          code: "EEE",
          description: "Department of Electrical Engineering",
          faculty: "Faculty of Engineering",
        },
      ]

      console.log("Creating departments...")
      for (const department of departments) {
        try {
          const response = await api.post("/department/", department)
          console.log(`Department ${department.name} created:`, response.data)
        } catch (error) {
          console.log(`Department ${department.name} error:`, error.response?.data)
        }
      }

      toast.success("Sample data created successfully!")
    } catch (error) {
      console.error("Error creating sample data:", error)
      toast.error("Failed to create sample data")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">System Setup</h1>
          <p className="text-gray-600">Create initial faculties and departments</p>
        </div>

        <div className="text-center">
          <Button onClick={createSampleData} disabled={loading} size="lg">
            {loading ? "Creating..." : "Create Sample Data"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            This will create sample faculties and departments to get you started
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Faculty</CardTitle>
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
              <CardTitle>Create Department</CardTitle>
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

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Department"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            After creating faculties and departments, you can{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-500">
              register users
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
