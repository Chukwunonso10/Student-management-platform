const mongoose = require('mongoose')

const facultySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true,},
    code: {type: String, required: true},
    description: String,
    dean: {type: mongoose.Schema.Types.ObjectId, ref: "Lecturer", default: null},
    contactEmail: {type: String, required: true},
    contactPhone: {type: String, required: true},
    isActive: {type: Boolean, default: true}
}, {timestamps: true})

const Faculty = mongoose.model("Faculty", facultySchema)
module.exports = Faculty;