const express = require("express")
const router = express.Router()

// Import controllers with error handling
let getAllFaculty, getMyFaculty, deleteFaculty, updateFaculty, createFaculty

try {
  const facultyControllers = require("../controllers/facultyControllers")
  getAllFaculty = facultyControllers.getAllFaculty
  getMyFaculty = facultyControllers.getMyFaculty
  deleteFaculty = facultyControllers.deleteFaculty
  updateFaculty = facultyControllers.updateFaculty
  createFaculty = facultyControllers.createFaculty

  // Verify all functions are loaded
  if (!getAllFaculty || !getMyFaculty || !deleteFaculty || !updateFaculty || !createFaculty) {
    throw new Error("One or more faculty controller functions are undefined")
  }
} catch (error) {
  console.error("❌ Error loading faculty controllers:", error.message)
  process.exit(1)
}

const authenticate = require("../middleware/auth")

// Public routes (no authentication required) - for setup and registration
router.get("/all", getAllFaculty)
router.post("/", createFaculty)

// Protected routes (authentication required)
router.get("/me/:id", authenticate, getMyFaculty)
router.delete("/:id", authenticate, deleteFaculty)
router.put("/:id", authenticate, updateFaculty)

module.exports = router
