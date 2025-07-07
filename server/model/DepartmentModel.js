const mongoose = require('mongoose')
const Faculty = require('./FacultyModel')

const departmentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true},
    description: String,
    faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty"}

}, {timestamps: true})

const Department = mongoose.model("Department", departmentSchema)
module.exports = Department;