const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    code: {type: String, required: true, uppercase: true},
    unit: {type: Number, required: true, min: 1, max: 6},
    lecturer: {type:String},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    enrolledStudents: [{type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    level: {type: Number, enum: ["100","200","300","400","500"]},
    semester: {type: String, enum: ["Ist Semester", "2nd Semester"],required: true},
    isActive: {type: Boolean, default: true}

}, {timestamps: true})

const Course = mongoose.model("Course", courseSchema)
module.exports = Course;