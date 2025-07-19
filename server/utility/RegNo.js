const mongoose = require("mongoose")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")
const Student = require("../models/UserModel")

const generateRegNo = async (facultyName, departmentName) => {
  try {
    console.log("Generating regNo for:", { facultyName, departmentName })

    // Find faculty by name
    const faculty = await Faculty.findOne({ name: facultyName })
    if (!faculty) {
      const availableFaculties = await Faculty.find({}, "name")
      console.log(
        "Available faculties:",
        availableFaculties.map((f) => f.name),
      )
      throw new Error(
        `Faculty '${facultyName}' not found! Available faculties: ${availableFaculties.map((f) => f.name).join(", ")}`,
      )
    }
    console.log("Found faculty:", faculty.name, faculty.code)

    const facultyCode = faculty.code

    // Find department by name and faculty
    const department = await Department.findOne({
      name: departmentName,
      faculty: faculty._id,
    })
    if (!department) {
      const availableDepartments = await Department.find({ faculty: faculty._id }, "name")
      console.log(
        "Available departments for this faculty:",
        availableDepartments.map((d) => d.name),
      )
      throw new Error(
        `Department '${departmentName}' not found in faculty '${facultyName}'! Available departments: ${availableDepartments.map((d) => d.name).join(", ")}`,
      )
    }
    console.log("Found department:", department.name, department.code)

    const deptCode = department.code
    const year = new Date().getFullYear().toString().slice(-2)
    const prefix = `${facultyCode}/${deptCode}/${year}/`

    // Escape slashes for RegExp
    const escapedPrefix = prefix.replace(/\//g, "\\/")
    const pattern = new RegExp(`^${escapedPrefix}`)

    // Count existing students with this pattern
    const count = await Student.countDocuments({ regNo: pattern })
    const studentNum = String(count + 1).padStart(3, "0")

    const regNo = `${prefix}${studentNum}`
    console.log("Generated regNo:", regNo)

    return regNo
  } catch (error) {
    console.error("Error in generateRegNo:", error)
    throw error
  }
}

module.exports = generateRegNo
