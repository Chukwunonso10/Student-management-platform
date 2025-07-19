const express = require("express")
const path = require("path")
const ConnectDB = require("./config/db")
const dotenv = require("dotenv")
const cors = require("cors")

// Load environment variables first
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
console.log("Express version:", require("express/package.json").version)

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Test route to verify server is working (before other routes)
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    expressVersion: require("express/package.json").version,
  })
})

// Import and use routes with proper error handling
console.log("Loading routes...")

try {
  const healthRoute = require("./Routes/healthRoute")
  app.use("/api/health", healthRoute)
  console.log("✅ Health route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load health route:", error.message)
  process.exit(1)
}

try {
  const setupRoute = require("./Routes/setupRoute")
  app.use("/api/setup", setupRoute)
  console.log("✅ Setup route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load setup route:", error.message)
  process.exit(1)
}

try {
  const authRoute = require("./Routes/authRoute")
  app.use("/api/auth", authRoute)
  console.log("✅ Auth route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load auth route:", error.message)
  process.exit(1)
}

try {
  const facultyRoute = require("./Routes/facultyRoute")
  app.use("/api/faculty", facultyRoute)
  console.log("✅ Faculty route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load faculty route:", error.message)
  process.exit(1)
}

try {
  const departmentRoute = require("./Routes/departmentRoute")
  app.use("/api/department", departmentRoute)
  console.log("✅ Department route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load department route:", error.message)
  process.exit(1)
}

try {
  const courseRoute = require("./Routes/courseRoute")
  app.use("/api/course", courseRoute)
  console.log("✅ Course route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load course route:", error.message)
  process.exit(1)
}

try {
  const lecturerRoute = require("./Routes/lecturerRoute")
  app.use("/api/lecturer", lecturerRoute)
  console.log("✅ Lecturer route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load lecturer route:", error.message)
  process.exit(1)
}

console.log("All routes loaded successfully!")

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "dist")
  console.log("Serving static files from:", buildPath)

  // Check if dist folder exists
  const fs = require("fs")
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
    console.log("✅ Static files middleware configured")

    // Handle React routing - send all non-API requests to React app
    app.get("*", (req, res) => {
      const indexPath = path.join(buildPath, "index.html")
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath)
      } else {
        res.status(404).json({ message: "Frontend build not found" })
      }
    })
  } else {
    console.log("⚠️ Build folder not found, serving API only")
    app.get("/", (req, res) => {
      res.json({
        message: "Student Management API is running! (Frontend build not found)",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      })
    })
  }
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
    console.log("Connecting to database...")
    await ConnectDB()

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`⚙️ Setup endpoint: http://localhost:${PORT}/api/setup/status`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`📦 Express version: ${require("express/package.json").version}`)
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
