const Course = require("../models/CourseModel")
const Department = require("../models/DepartmentModel")
const Student = require("../models/UserModel")

const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, lecturer, department, semester, isActive, enrollStudents } = req.query
    const query = { isActive: true }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { code: { $regex: search, $options: "i" } }]
    }
    if (lecturer) query.lecturer = lecturer
    if (department) query.department = department
    if (semester) query.semester = semester

    const courses = await Course.find(query)
      .populate("department", "name code")
      .populate("enrolledStudents", "firstName lastName email") // Fixed: was "fullname"
      .sort({ code: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    if (courses.length == 0) return res.status(200).json({ message: "Course is currently empty" })
    const total = await Course.countDocuments(query) // Fixed: added await
    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit), // Fixed: Math instead of math
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getMyCourses = async (req, res) => {
  try {
    const { id } = req.params
    const course = await Course.findById(id) // Fixed: removed object wrapper
      .populate("department", "name code")
      .populate("enrolledStudents", "firstName lastName email") // Fixed: was "fullname"
      .sort({ code: 1 })

    if (!course) return res.status(404).json({ message: "No Course was found! " })
    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ message: "server Error", error: error.message })
  }
}

const createCourses = async (req, res) => {
  try {
    const { title, code, unit, departmentName, semester } = req.body // Added semester

    // Validate required fields
    if (!title || !code || !unit || !departmentName || !semester) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const courseExists = await Course.findOne({ title: title })
    if (courseExists) return res.status(409).json({ message: "Course already exist " })

    const foundDept = await Department.findOne({ name: departmentName })
    if (!foundDept) return res.status(404).json({ message: "department Not Found! " })

    const newcourse = await Course.create({
      title,
      code,
      unit: Number.parseInt(unit), // Ensure unit is a number
      department: foundDept._id,
      semester,
    })
    if (!newcourse) return res.status(500).json({ message: "unable to create " })
    res.status(201).json(newcourse)
  } catch (error) {
    console.error("Create course error:", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    const course = await Course.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true }) // Fixed: variable name conflict
    if (!course) return res.status(500).json({ message: "unable to update" })
    res.status(200).json(course)
  } catch (error) {
    console.error("unable to update", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deletecourse = async (req, res) => {
  try {
    const { id } = req.params
    const course = await Course.findByIdAndUpdate(id, { isActive: false }, { new: true }) // Fixed: variable name conflict
    if (!course) return res.status(500).json({ message: " unable to delete" })
    res.status(200).json({ message: "course successfully Deleted.." })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const enrollStudents = async (req, res) => {
  const { regNo, code } = req.body
  try {
    const student = await Student.findOne({ regNo: regNo })
    if (!student) return res.status(404).json({ message: " student not found" })

    const course = await Course.findOne({ code })
    if (!course) return res.status(404).json({ message: "coursecode not found " }) // Fixed: return statement

    //Check if already enrolled
    const alreadyEnrolled = student.courses.some((c) => c.courseId.toString() === course._id.toString())
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Student already enrolled in this course" })
    }

    course.enrolledStudents.push(student._id)
    student.courses.push({ courseId: course._id, courseName: course.title })

    await student.save()
    await course.save()

    res.status(201).json({ message: " student enrolled successfully " })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "enrollment failed", error: error.message })
  }
}

const getAllEnrollments = async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: { $exists: true, $not: { $size: 0 } } })
      .populate("enrolledStudents", "firstName lastName email ")
      .populate("department", "name code ") // Fixed: was "departments"
    res.status(200).json(courses)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "getting All Enrollment array failed", error: error.message })
  }
}

module.exports = {
  getAllCourses,
  createCourses,
  updateCourse,
  deletecourse,
  getAllEnrollments,
  enrollStudents,
}
