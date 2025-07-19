const express = require("express")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const router = express.Router()

// Get system status
router.get("/status", async (req, res) => {
  try {
    const [facultyCount, departmentCount, userCount] = await Promise.all([
      Faculty.countDocuments(),
      Department.countDocuments(),
      User.countDocuments(),
    ])

    res.json({
      status: "success",
      data: {
        faculties: facultyCount,
        departments: departmentCount,
        users: userCount,
        isEmpty: facultyCount === 0 && departmentCount === 0 && userCount === 0,
      },
    })
  } catch (error) {
    console.error("Error getting system status:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to get system status",
      error: error.message,
    })
  }
})

// Initialize system with sample data
router.post("/initialize", async (req, res) => {
  try {
    console.log("🚀 Initializing system...")

    // Check if already initialized
    const existingFaculties = await Faculty.countDocuments()
    if (existingFaculties > 0) {
      return res.status(400).json({
        status: "error",
        message: "System already initialized",
      })
    }

    // Create Faculties
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
      {
        name: "Faculty of Business",
        code: "BUS",
        description: "Faculty of Business Administration",
        contactEmail: "business@university.com",
        contactPhone: "+1234567893",
      },
    ]

    const createdFaculties = await Faculty.insertMany(faculties)
    console.log(`✅ Created ${createdFaculties.length} faculties`)

    // Create Departments
    const departments = [
      // Science Faculty
      {
        name: "Computer Science",
        code: "CSC",
        description: "Department of Computer Science",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      {
        name: "Mathematics",
        code: "MTH",
        description: "Department of Mathematics",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      {
        name: "Physics",
        code: "PHY",
        description: "Department of Physics",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Science")._id,
      },
      // Arts Faculty
      {
        name: "English Literature",
        code: "ENG",
        description: "Department of English Literature",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Arts")._id,
      },
      {
        name: "History",
        code: "HIS",
        description: "Department of History",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Arts")._id,
      },
      // Engineering Faculty
      {
        name: "Civil Engineering",
        code: "CVE",
        description: "Department of Civil Engineering",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Engineering")._id,
      },
      {
        name: "Electrical Engineering",
        code: "EEE",
        description: "Department of Electrical Engineering",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Engineering")._id,
      },
      // Business Faculty
      {
        name: "Business Administration",
        code: "BBA",
        description: "Department of Business Administration",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Business")._id,
      },
      {
        name: "Accounting",
        code: "ACC",
        description: "Department of Accounting",
        faculty: createdFaculties.find((f) => f.name === "Faculty of Business")._id,
      },
    ]

    const createdDepartments = await Department.insertMany(departments)
    console.log(`✅ Created ${createdDepartments.length} departments`)

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const adminUser = await User.create({
      firstName: "System",
      lastName: "Administrator",
      email: "admin@university.com",
      password: hashedPassword,
      role: "Admin",
      faculty: createdFaculties[0]._id,
      department: createdDepartments[0]._id,
      isActive: true,
    })

    console.log("✅ System initialized successfully")

    res.json({
      status: "success",
      message: "System initialized successfully",
      data: {
        faculties: createdFaculties.length,
        departments: createdDepartments.length,
        adminCreated: true,
        adminEmail: "admin@university.com",
        adminPassword: "admin123",
      },
    })
  } catch (error) {
    console.error("Error initializing system:", error)
    res.status(500).json({
      status: "error",
      message: "Failed to initialize system",
      error: error.message,
    })
  }
})

module.exports = router
