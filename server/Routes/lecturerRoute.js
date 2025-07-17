const express = require('express')
const { getAllLecturers, getMyLecturer, createLecturer, updateLecturer, deleteLecturer } = require('../controllers/lecturerControllers');
const authenticate = require('../middleware/auth');
const router = express.Router();


router.get('/',authenticate, getAllLecturers)
router.get('/:id',authenticate, getMyLecturer)
router.post('/', authenticate,createLecturer)
router.put('/:id',authenticate, updateLecturer)
router.delete('/:id',authenticate, deleteLecturer)


module.exports = router;




