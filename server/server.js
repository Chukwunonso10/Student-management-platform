const express = require("express")
const path = require("path")
const ConnectDB = require("./config/db")
const dotenv = require("dotenv")
const cors = require("cors")

// Load environment variables first
dotenv.config()

console.log("🚀 Starting Student Management System...")
console.log("📊 Environment Variables Check:")
console.log("  NODE_ENV:", process.env.NODE_ENV || "❌ Not set")
console.log("  PORT:", process.env.PORT || "❌ Not set")
console.log("  MONGO_URI:", process.env.MONGO_URI ? "✅ Configured" : "❌ Not configured")
console.log("  JWT_SIGN:", process.env.JWT_SIGN ? "✅ Configured" : "❌ Not configured")

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SIGN"]
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:")
  missingEnvVars.forEach((envVar) => console.error(`  - ${envVar}`))
  console.error("")
  console.error("🔧 SOLUTION: Add these environment variables in Render:")
  console.error("  1. Go to your Render service dashboard")
  console.error("  2. Click 'Environment' tab")
  console.error("  3. Add the missing variables")

  if (process.env.NODE_ENV === "production") {
    console.error("💥 Exiting due to missing environment variables in production")
    process.exit(1)
  }
}

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// CORS configuration - Allow your Vercel frontend
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app", // Replace with your actual Vercel URL
    /\.vercel\.app$/, // Allow all Vercel subdomains
  ],
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

// Root route - this was missing!
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Student Management API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/api/health",
      test: "/api/test",
      setup: "/api/setup/status",
      auth: "/api/auth/*",
      faculty: "/api/faculty/*",
      department: "/api/department/*",
      course: "/api/course/*",
      lecturer: "/api/lecturer/*",
    },
  })
})

// API root route - this was also missing!
app.get("/api", (req, res) => {
  res.json({
    message: "🚀 Student Management API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    status: "running",
    endpoints: [
      "GET /api/health - Health check",
      "GET /api/test - Test endpoint",
      "GET /api/setup/status - System status",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "GET /api/faculty/all - Get all faculties",
      "GET /api/department/all - Get all departments",
    ],
  })
})

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ API is working perfectly!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "not-set",
    expressVersion: require("express/package.json").version,
    envCheck: {
      mongoUri: process.env.MONGO_URI ? "configured" : "missing",
      jwtSign: process.env.JWT_SIGN ? "configured" : "missing",
      nodeEnv: process.env.NODE_ENV || "not-set",
      port: process.env.PORT || "not-set",
    },
  })
})

// Import and use routes with proper error handling
console.log("📦 Loading routes...")

try {
  const healthRoute = require("./Routes/healthRoute")
  app.use("/api/health", healthRoute)
  console.log("✅ Health route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load health route:", error.message)
}

try {
  const setupRoute = require("./Routes/setupRoute")
  app.use("/api/setup", setupRoute)
  console.log("✅ Setup route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load setup route:", error.message)
}

try {
  const authRoute = require("./Routes/authRoute")
  app.use("/api/auth", authRoute)
  console.log("✅ Auth route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load auth route:", error.message)
}

try {
  const facultyRoute = require("./Routes/facultyRoute")
  app.use("/api/faculty", facultyRoute)
  console.log("✅ Faculty route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load faculty route:", error.message)
}

try {
  const departmentRoute = require("./Routes/departmentRoute")
  app.use("/api/department", departmentRoute)
  console.log("✅ Department route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load department route:", error.message)
}

try {
  const courseRoute = require("./Routes/courseRoute")
  app.use("/api/course", courseRoute)
  console.log("✅ Course route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load course route:", error.message)
}

try {
  const lecturerRoute = require("./Routes/lecturerRoute")
  app.use("/api/lecturer", lecturerRoute)
  console.log("✅ Lecturer route loaded and mounted")
} catch (error) {
  console.error("❌ Failed to load lecturer route:", error.message)
}

console.log("✅ All routes loaded successfully!")

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    timestamp: new Date().toISOString(),
  })
})

// Handle 404 - this should be last
app.use((req, res) => {
  console.log("404 - Route not found:", req.path)
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    availableRoutes: ["/", "/api", "/api/health", "/api/test", "/api/setup/status"],
    timestamp: new Date().toISOString(),
  })
})

const PORT = process.env.PORT || 5000

// Connect to database first, then start server
const startServer = async () => {
  try {
    console.log("🔄 Connecting to database...")
    await ConnectDB()

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`⚙️ Setup endpoint: http://localhost:${PORT}/api/setup/status`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log("🎉 Server started successfully!")
    })
  } catch (error) {
    console.error("❌ Failed to start server:", error.message)

    // Don't exit in production, try to start server anyway
    if (process.env.NODE_ENV !== "production") {
      process.exit(1)
    } else {
      console.log("⚠️ Starting server without database connection...")
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`⚠️ Server running on port ${PORT} (without database)`)
      })
    }
  }
}

startServer()
