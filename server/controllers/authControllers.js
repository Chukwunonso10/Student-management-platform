const User = require("../models/UserModel")
const generateRegNo = require("../utility/RegNo")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Faculty = require("../models/FacultyModel")
const Department = require("../models/DepartmentModel")

const signup = async (req, res) => {
  const { firstName, lastName, password, email, facultyName, departmentName, role } = req.body
  if (!firstName || !lastName || !password || !email || !facultyName || !departmentName)
    return res.status(400).json({ message: "All fields are required" }) // Fixed: 400 instead of 500
  try {
    const faculty = await Faculty.findOne({ name: facultyName })
    console.log("faculty", faculty)
    if (!faculty) return res.status(404).json({ message: "Faculty does not exist " })

    const department = await Department.findOne({ name: departmentName })

    if (!department) return res.status(404).json({ message: "department doesnt exist" })

    const userExists = await User.findOne({ email })

    if (userExists) return res.status(409).json({ message: "User already exists, log in " })
    const hashedPassword = await bcrypt.hash(password, 10)

    // Only generate regNo for students
    let regNo = null
    if (!role || role === "student") {
      regNo = await generateRegNo(facultyName, departmentName)
    }

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      regNo,
      department: department._id,
      faculty: faculty._id,
      role: role || "student", // Add role to user creation
    })

    if (!user) return res.status(500).json({ message: "Unable to create User" })
    const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName }, process.env.JWT_SIGN, {
      expiresIn: "1hr",
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        regNo: user.regNo,
        role: user.role || "student",
      },
      message: "user successfully created",
    })
  } catch (error) {
    console.error("Error occurred while creating account: ", error.message)
    res.status(500).json({ message: error.message }) // Fixed: return proper error message
  }
}

//controller for login

const login = async (req, res) => {
  const { password, email } = req.body
  if (!password.trim() || !email.trim()) return res.status(400).json({ message: "All fields are required" }) // Fixed: 400 instead of 500
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "Email is not registered! sign up" })
    const ismatch = await bcrypt.compare(password, user.password)
    if (ismatch) {
      const token = jwt.sign({ userId: user._id, email: user.email, firstName: user.firstName }, process.env.JWT_SIGN, {
        expiresIn: "1hr",
      })
      res.status(200).json({
        // Fixed: 200 instead of 201 for login
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: email,
          regNo: user.regNo,
          role: user.role || "student",
        },
        message: "user successfully logged in", // Fixed: login message
      })
    } else {
      res.status(400).json({ message: "passwords doesn't match || invalid credentials" })
    }
  } catch (error) {
    console.error("Error occurred while logging in: ", error.message)
    res.status(500).json({ message: error.message }) // Fixed: return proper error message
  }
}

//GET ALL STUDENTS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("faculty department")
    if (users.length == 0) return res.status(404).json({ message: "No students is in the database " })
    res.status(200).json({
      data: users,
      success: true, // Fixed: typo
      message: "successful",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//GET A SINGLE STUDENT BY REG NO
const getMyUser = async (req, res) => {
  try {
    const { regNo } = req.params
    const user = await User.findOne({ regNo: regNo }).populate("faculty department")

    if (!user) return res.status(404).json({ message: `User with regNo: ${regNo}  not found!` })
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        regNo: user.regNo,
      },
      message: "successful", // Fixed: typo
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getMyUser,
}
