const express = require('express')
const router = express.Router()
const { getAllCourses, updateCourse, deletecourse, getAllEnrollments, enrollStudents, createCourses } = require('../controllers/courseController')
const authenticate = require('../middleware/auth')



router.get('/all', authenticate, getAllCourses)
router.post('/', authenticate, createCourses)
router.get('/all', authenticate, getAllEnrollments)
router.put('/:id', authenticate, updateCourse)
router.delete('/:id', authenticate, deletecourse)
router.post('/enroll', authenticate, enrollStudents)


module.exports = router;