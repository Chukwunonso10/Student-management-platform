const Student = require('../model/StudentModel')
const Lecturer = require('../model/LecturersModel')



//CRUD OPERATIONS ON STUDENTS

//GET ALL STUDENTS
const getAllStudents =async (req, res) => {
    const students = await Student.find().populate("faculty department")
    console.log("found students",students)
    if (students.length == 0) return res.status(500).json({ message: "No students is in the database "})
    console.log("before res",students)
    res.status(200).json({students});
}

//GET A SINGLE STUDENT BY REG NO
const getSingleStudent = async (req, res) =>{
    const { regNo } = req.params
    const student = await Student.findOne({ regNo: regNo }).populate("faculty department")
    
    if (!student) return res.status(404).json({message: `Student with regNo: ${regNo}  not found!`})
    res.status(200).json(student)
}

module.exports = {
    getAllStudents,
    getSingleStudent
}