const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    code: {type: String, required: true},
    unit: {type: Number, required: true, min: 1, max: 6},
    lecturer: {type:String},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    enrolledStudents: [{type: mongoose.Schema.Types.ObjectId, ref: "Student" }]

}, {timestamps: true})

const Course = mongoose.model("Course", courseSchema)
module.exports = Course;