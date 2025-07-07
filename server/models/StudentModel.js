const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    age: {type: Number},
    gender: {type: String, enum:["Male", "Female", "Others"], default: "Others"},
    phoneNo: {type: String},
    dateOfBirth: {type: Date},
    address: {
        street: String,
        town: String,
        state: String,
        country: String,
        postalCode: Number
    },
    courses:[{
        courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
        courseName: String,
        grade: String
}],
    enrollmentDate: {type: Date, default: Date.now},
    isActive: {type: Boolean, default: false},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref:"Faculty"},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
    regNo: {type: String, required: true, unique: true}

    
}, {timestamps: true})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student;