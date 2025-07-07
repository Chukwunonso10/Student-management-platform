const Course = require('../model/courseModel')
const Department = require('../model/DepartmentModel')
const Student = require('../model/StudentModel')

const getCourses =async (req, res) =>{
    try {
        const courses = await Course.find().populate("department enrolledStudents")
        if (courses.length == 0) return res.status(200).json({ message: "Course is currently empty"})
        res.status(200).json(courses)
    } catch (error) {
        console.error(error.message)
    }
}
const createCourses = async (req, res) =>{
    try {
        const { title, code, unit, departmentName } = req.body
        const courseIsExists = await Course.findOne({ title: title })
        if (courseIsExists) return res.status(409).json({ message: "Course already exist "})

        const foundDept = await Department.findOne({ name: departmentName })
        if (!foundDept) return res.status(404).json({ message: "department Not Found! "})
        
        const newcourse = await Course.create({ title, code, unit, department: foundDept._id })
        if (!newcourse) return res.status(500).json({ message: "unable to create "})
        res.status(201).json(newcourse)
        
    
    } catch (error) {
        console.error(error.message)
    }
}

const modifyCourse = async (req, res) =>{
    try {
        const { code } = req.params;
        const course = await Course.findOne({ code })
        if (!course) return res.status(404).json({ message: "course code cannot be found "})
        const updatedCourse = await Course.findOneAndUpdate({ code }, {$set: req.body}, {new: true, runValidators: true})
        if (!updatedCourse) return res.status(500).json({ message: "unable to update"})
        res.status(200).json(updatedCourse)
    } catch (error) {
        console.error("unable to update", error.message)
    }
}

const deletecourse = async (req, res) =>{
    const { code } = req.params;
    const deletedCourse = await Course.findOneAndDelete({ code })
    if (!deletedCourse) return res.status(500).json({ message: " unable to delete"})
    res.status(200).json(deletedCourse)
}

const enrollStudents = async (req,res) =>{
    const { regNo, code } = req.body
    try {
        const student = await Student.findOne({ regNo: regNo})
        if (!student) return res.status(404).json({ message: " student not found"})

        const course = await Course.findOne({ code })
        if (!code) res.status(400).json({ message: "coursecode not found "})

        //Check if already enrolled
        const alreadyEnrolled = student.courses.some(c => c.courseId.toString() === course._id.toString());
        if (alreadyEnrolled) {
            return res.status(409).json({ message: "Student already enrolled in this course" });
        }

        course.enrolledStudents.push(student._id)
        student.courses.push({courseId: course._id, courseName: course.title  })
        

        await student.save()
        await course.save()

        res.status(201).json({ message: " student enrolled sucessfully "})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "enrollment failed", error:error.message})
    }
}

const getAllEnrollments = async (req, res) =>{
    try {
        const courses = await Course.find({ enrolledStudent: {$exists: true, $not: {$size: 0}}})
                        .populate("enrolledStudents", "firstName lastName email ")
        res.status(200).json(courses)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: "getting All Enrollment array failed", error: error.message})
    }
}

module.exports = {
    getCourses,
    createCourses,
    modifyCourse,
    deletecourse,
    getAllEnrollments,
    enrollStudents
}