const express = require('express');
const { getAllStudents, getSingleStudent } = require('../controllers/studentControllers');
const router = express.Router();



//other routes
router.get("/all", getAllStudents)
//router.get("/me/:regNo", getSingleStudent)


module.exports = router;
