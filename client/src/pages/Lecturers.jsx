import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Lecturers() {
  const { user } = useAuth()
  const [lecturers, setLecturers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    contactEmail: "",
    contactPhone: "",
    title: "",
    LecturerStatus: "",
    department: "",
  })

  useEffect(() => {
    fetchLecturers()
    fetchDepartments()
  }, [])

  const fetchLecturers = async () => {
    try {
      const response = await api.get("/lecturer/")
      setLecturers(response.data.lecturers || [])
    } catch (error) {
      console.error("Error fetching lecturers:", error)
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

  const handleCreateLecturer = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/lecturer/", formData)
      toast.success("Lecturer created successfully!")
      setShowCreateForm(false)
      setFormData({
        firstName: "",
        LastName: "",
        contactEmail: "",
        contactPhone: "",
        title: "",
        LecturerStatus: "",
        department: "",
      })
      fetchLecturers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lecturer")
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
          <h1 className="text-2xl font-bold text-gray-900">Lecturers</h1>
          <p className="text-gray-600">Manage lecturer records</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>Add Lecturer</Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Lecturer</CardTitle>
            <CardDescription>Create a new lecturer record</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLecturer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Input
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Input
                    name="LastName"
                    required
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <select
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Title</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="LecturerStatus"
                    required
                    value={formData.LecturerStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="senior Lecturer">Senior Lecturer</option>
                    <option value="junior Lecturer">Junior Lecturer</option>
                    <option value="Professor">Professor</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Lecturer"}
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
        {lecturers.map((lecturer) => (
          <Card key={lecturer._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {lecturer.title} {lecturer.firstName} {lecturer.LastName}
              </CardTitle>
              <CardDescription>{lecturer.LecturerStatus}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium text-sm">{lecturer.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-medium">{lecturer.contactPhone}</span>
                </div>
                {lecturer.department && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <span className="font-medium text-sm">{lecturer.department.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lecturers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No lecturers available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
