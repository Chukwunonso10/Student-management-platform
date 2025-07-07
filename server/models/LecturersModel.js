const mongoose = require('mongoose')
const Department = require('./DepartmentModel')
const Faculty = require('./FacultyModel')

const lecturerSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    LastName: {type: String, required: true},
    LecturerStatus: {type: String, enum: ["senior Lecturer", "junior Lecturer", "Professor", "Others"]},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"}
}, {timestamps: true})

const Lecturer = mongoose.model("Lecturer", lecturerSchema)
module.exports = Lecturer;