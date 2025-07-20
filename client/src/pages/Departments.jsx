import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Departments() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    faculty: "",
  })

  useEffect(() => {
    fetchDepartments()
    fetchFaculties()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department/all")
      setDepartments(response.data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/faculty/all")
      setFaculties(response.data || [])
    } catch (error) {
      console.error("Error fetching faculties:", error)
    }
  }

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/department/", formData)
      toast.success("Department created successfully!")
      setShowCreateForm(false)
      setFormData({
        name: "",
        code: "",
        description: "",
        faculty: "",
      })
      fetchDepartments()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create department")
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have permission to view this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage department records</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>Add Department</Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Department</CardTitle>
            <CardDescription>Create a new department</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <Input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter department name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                  <Input
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter department code"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                  <select
                    name="faculty"
                    required
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty._id} value={faculty.name}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter department description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Department"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department._id}>
            <CardHeader>
              <CardTitle className="text-lg">{department.name}</CardTitle>
              <CardDescription>{department.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {department.faculty && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Faculty:</span>
                    <span className="font-medium text-sm">{department.faculty.name}</span>
                  </div>
                )}
                {department.description && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{department.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No departments available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
