const express = require("express")
const router = express.Router()

// Import controllers with error handling
let createDepartment, getAllDeparments, getMyDeparment, deleteDepartment, updateDepartment

try {
  const departmentControllers = require("../controllers/departmentControllers")
  createDepartment = departmentControllers.createDepartment
  getAllDeparments = departmentControllers.getAllDeparments
  getMyDeparment = departmentControllers.getMyDeparment
  deleteDepartment = departmentControllers.deleteDepartment
  updateDepartment = departmentControllers.updateDepartment

  // Verify all functions are loaded
  if (!createDepartment || !getAllDeparments || !getMyDeparment || !deleteDepartment || !updateDepartment) {
    throw new Error("One or more department controller functions are undefined")
  }
} catch (error) {
  console.error("❌ Error loading department controllers:", error.message)
  process.exit(1)
}

const authenticate = require("../middleware/auth")

// Public routes (no authentication required) - for setup and registration
router.get("/all", getAllDeparments)
router.post("/", createDepartment)

// Protected routes (authentication required)
router.get("/me/:id", authenticate, getMyDeparment)
router.put("/:id", authenticate, updateDepartment)
router.delete("/:id", authenticate, deleteDepartment)

module.exports = router
