const express = require("express")
const router = express.Router()

// Import controllers with error handling
let signup, login, getMyUser, getAllUsers

try {
  const authControllers = require("../controllers/authControllers")
  signup = authControllers.signup
  login = authControllers.login
  getMyUser = authControllers.getMyUser
  getAllUsers = authControllers.getAllUsers

  // Verify all functions are loaded
  if (!signup || !login || !getMyUser || !getAllUsers) {
    throw new Error("One or more auth controller functions are undefined")
  }
} catch (error) {
  console.error("❌ Error loading auth controllers:", error.message)
  process.exit(1)
}

const authenticate = require("../middleware/auth")

// Public routes (no authentication required)
router.post("/register", signup)
router.post("/login", login)

// Protected routes (authentication required)
router.get("/me", authenticate, getMyUser)
router.get("/all", authenticate, getAllUsers)

module.exports = router
