import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function Faculties() {
  const { user } = useAuth()
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  })

  useEffect(() => {
    fetchFaculties()
  }, [])

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/faculty/all")
      setFaculties(response.data || [])
    } catch (error) {
      console.error("Error fetching faculties:", error)
    }
  }

  const handleCreateFaculty = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/faculty/", formData)
      toast.success("Faculty created successfully!")
      setShowCreateForm(false)
      setFormData({
        name: "",
        code: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
      })
      fetchFaculties()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create faculty")
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
          <h1 className="text-2xl font-bold text-gray-900">Faculties</h1>
          <p className="text-gray-600">Manage faculty records</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>Add Faculty</Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Faculty</CardTitle>
            <CardDescription>Create a new faculty</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFaculty} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                  <Input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter faculty name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Code</label>
                  <Input
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter faculty code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input
                    name="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter contact email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <Input
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="Enter contact phone"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter faculty description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Faculty"}
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
        {faculties.map((faculty) => (
          <Card key={faculty._id}>
            <CardHeader>
              <CardTitle className="text-lg">{faculty.name}</CardTitle>
              <CardDescription>{faculty.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium text-sm">{faculty.contactEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-medium">{faculty.contactPhone}</span>
                </div>
                {faculty.description && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{faculty.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {faculties.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No faculties available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
