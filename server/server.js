const express = require("express")
const path = require("path")
const authRoute = require("./Routes/authRoute")
const ConnectDB = require("./config/db")
const dotenv = require("dotenv")
const cors = require("cors")
const courseRoute = require("./Routes/courseRoute")
const departmentRoute = require("./Routes/departmentRoute")
const facultyRoute = require("./Routes/facultyRoute")
const lecturerRoute = require("./Routes/lecturerRoute")
const healthRoute = require("./Routes/healthRoute")
const setupRoute = require("./Routes/setupRoute")

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SIGN"]
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:")
  missingEnvVars.forEach((envVar) => console.error(`  - ${envVar}`))
  process.exit(1)
}

console.log("🚀 Starting Student Management System...")
console.log("Environment:", process.env.NODE_ENV || "development")
console.log("Port:", process.env.PORT || 5000)

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS configuration - Allow all origins for now to debug
const corsOptions = {
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  if (req.headers.authorization) {
    console.log("  - Has Authorization header")
  } else {
    console.log("  - No Authorization header")
  }
  next()
})

// Health check route (should be first)
app.use("/api/health", healthRoute)

// Setup route (for production initialization)
app.use("/api/setup", setupRoute)

// API routes
app.use("/api/auth", authRoute)
app.use("/api/faculty", facultyRoute)
app.use("/api/department", departmentRoute)
app.use("/api/course", courseRoute)
app.use("/api/lecturer", lecturerRoute)

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "dist")
  console.log("Serving static files from:", buildPath)

  app.use(express.static(buildPath))

  // Handle React routing - send all non-API requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "Student Management API is running!",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    timestamp: new Date().toISOString(),
  })
})

// Handle 404
app.use((req, res) => {
  console.log("404 - Route not found:", req.path)
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    timestamp: new Date().toISOString(),
  })
})

const PORT = process.env.PORT || 5000

// Connect to database first, then start server
const startServer = async () => {
  try {
    await ConnectDB()

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`⚙️ Setup endpoint: http://localhost:${PORT}/api/setup/status`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
