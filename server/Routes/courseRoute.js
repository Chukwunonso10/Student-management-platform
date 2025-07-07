const express = require('express')
const router = express.Router()
const { getCourses, modifyCourse, deletecourse, getAllEnrollments, enrollStudents, createCourses } = require('../controllers/courseController')



router.get('/', getCourses)
router.post('/', createCourses)
router.get('/enrollment', getAllEnrollments)
//router.put('/:code', modifyCourse)
//router.delete('/:code', deletecourse)
//router.post('/create', enrollStudents)


module.exports = router;