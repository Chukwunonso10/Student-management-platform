const express = require("express")
const router = express.Router()

// Import controllers with error handling
let getAllCourses, updateCourse, deletecourse, getAllEnrollments, enrollStudents, createCourses

try {
  const courseControllers = require("../controllers/courseController")
  getAllCourses = courseControllers.getAllCourses
  updateCourse = courseControllers.updateCourse
  deletecourse = courseControllers.deletecourse
  getAllEnrollments = courseControllers.getAllEnrollments
  enrollStudents = courseControllers.enrollStudents
  createCourses = courseControllers.createCourses

  // Verify all functions are loaded
  if (!getAllCourses || !updateCourse || !deletecourse || !getAllEnrollments || !enrollStudents || !createCourses) {
    throw new Error("One or more course controller functions are undefined")
  }
} catch (error) {
  console.error("❌ Error loading course controllers:", error.message)
  process.exit(1)
}

const authenticate = require("../middleware/auth")

router.get("/all", authenticate, getAllCourses)
router.post("/", authenticate, createCourses)
router.get("/enrollments", authenticate, getAllEnrollments)
router.put("/:id", authenticate, updateCourse)
router.delete("/:id", authenticate, deletecourse)
router.post("/enroll", authenticate, enrollStudents)

module.exports = router
