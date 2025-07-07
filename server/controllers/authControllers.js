const Student = require('../models/StudentModel')
const generateRegNo = require('../utility/RegNo')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Faculty = require('../models/FacultyModel')
const Department = require('../models/DepartmentModel')
//sign up controllers

const signup = async (req, res) =>{
    const { firstName, lastName, password, email, facultyName, departmentName } = req.body;
    if ( !firstName || !lastName || !password || !email || !facultyName || !departmentName ) return res.status(500).json({message: "All fields are required"})
    try {
        const faculty = await Faculty.findOne({ name: facultyName})
        console.log("faculty",faculty)
        if (!faculty) return res.status(404).json({message: "Faculty does not exist "})

        const department = await Department.findOne({ name: departmentName })
        
        if (!department) return res.status(404).json({message: "department doesnt exist"})
        
        const studentExists = await Student.findOne({ email })
        
        if (studentExists) return res.status(409).json({message: "student already exists, log in "})
        const hashedPassword = await bcrypt.hash(password, 10)

        const regNo = await generateRegNo(facultyName, departmentName)

        const student = await Student.create({
             firstName,
            lastName, 
            password: hashedPassword, 
            email, 
            regNo,
            department: department._id,
            faculty: faculty._id
            })
            console.log("createdstudent",student)
        if (!student) return res.status(500).json({ message: "Unable to create student"})
        const token = jwt.sign({userId: student._id, email: student.email, firstName: student.firstName}, process.env.JWT_SIGN, {expiresIn: "1hr"})
        
        res.status(201).json(token)
        
    } catch (error) {
        console.error("Error occurred while creating account: ", error.message)
        res.status(500).json(error.message)
    }
    
} 

//controller for login

const login = async (req, res) =>{
    const { password, email } = req.body;
    if (!password.trim() || !email.trim() ) return res.status(500).json({message: "All fields are required"})
    try {
        const student = await Student.findOne({ email })
        if (!student) return res.status(404).json({ message: "Email is not registered! sign up"})
        const match = await bcrypt.compare(password, student.password)
        if (match){
            const token = await jwt.sign({userId: student._id, student: student.email, firstName: student.firstName}, process.env.JWT_SIGN, {expiresIn: "1hr"})
            res.status(201).json(token)
        }
        
        
    } catch (error) {
        console.error("Error occurred while logging in: ", error.message)
        res.status(500).json(error.message)
    }
}

const createfaculty = async (req, res) =>{
    const { name, code } = req.body
    const faculty = await Faculty.findOne({ name: name })

    if (faculty) return res.status(409).json({message: "faculty Name already exists"})
    const newfaculty = await Faculty.create({name: name, code: code})
    res.status(201).json(newfaculty)

}
    const createdept = async (req, res) =>{
    const { name, faculty, code } = req.body

    const dept = await Department.findOne({ name: name  })
    if (dept) return res.status(409).json({message: "department Name already exists"})

    
    const targetfaculty = await Faculty.findOne({ name: faculty })
    if (!targetfaculty) return res.status(409).json({message: "faculty doesn't already exists"})

    const newdept = await Department.create({name: name, faculty: targetfaculty._id, code: code})
    if (!newdept) throw new Error("unable to create new department")
    res.status(201).json(newdept)
}



module.exports = {
    signup,
    login,
    createfaculty,
    createdept
}