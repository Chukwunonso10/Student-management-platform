const express = require('express');
const { signup, login, createfaculty, createdept } = require('../controllers/authControllers');
const router = express.Router();


//sign up
router.post('/register', signup)

//login
router.post('/login', login)
router.post('/fac', createfaculty)
router.post('/dept', createdept)




module.exports = router;
