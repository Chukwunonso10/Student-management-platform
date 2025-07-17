const express = require('express');
const { signup, login, getMyUser, getAllUsers } = require('../controllers/authControllers');
const authenticate = require('../middleware/auth');
const router = express.Router();


//sign up
router.post('/register', signup)
router.post('/login', login)
router.get('/me',authenticate, getMyUser)
router.get('/all',authenticate, getAllUsers)




module.exports = router;
