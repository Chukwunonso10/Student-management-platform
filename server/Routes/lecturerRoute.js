const express = require("express")
const router = express.Router()

// Import controllers with error handling
let getAllLecturers, getMyLecturer, createLecturer, updateLecturer, deleteLecturer

try {
  const lecturerControllers = require("../controllers/lecturerControllers")
  getAllLecturers = lecturerControllers.getAllLecturers
  getMyLecturer = lecturerControllers.getMyLecturer
  createLecturer = lecturerControllers.createLecturer
  updateLecturer = lecturerControllers.updateLecturer
  deleteLecturer = lecturerControllers.deleteLecturer

  // Verify all functions are loaded
  if (!getAllLecturers || !getMyLecturer || !createLecturer || !updateLecturer || !deleteLecturer) {
    throw new Error("One or more lecturer controller functions are undefined")
  }
} catch (error) {
  console.error("❌ Error loading lecturer controllers:", error.message)
  process.exit(1)
}

const authenticate = require("../middleware/auth")

router.get("/", authenticate, getAllLecturers)
router.get("/:id", authenticate, getMyLecturer)
router.post("/", authenticate, createLecturer)
router.put("/:id", authenticate, updateLecturer)
router.delete("/:id", authenticate, deleteLecturer)

module.exports = router
