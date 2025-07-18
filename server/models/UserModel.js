const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    email: {type: String, required: true, unique: true },
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
    isActive: {type: Boolean, default: true},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref:"Faculty"},
    department: {type: mongoose.Schema.Types.ObjectId, ref: "Department", required: function () {
                                                                            this.role === "lecturer"
    }},
    role: {type: String, enum: ["student", "Admin","Lecturer"], default: "student"},
    regNo: {type: String, required: function () {
                                        return this.role === "student"
    }, unique: true},
    yearOfStudy: {type: Number, required: function () {
                                    return this.role === "student"
    }, default: function (){
        return this.role ==="student" ? new Date().getFullYear() : null
    }}
    
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)
module.exports = User;