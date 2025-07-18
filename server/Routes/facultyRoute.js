const express = require('express');
const { getAllFaculty, getMyFaculty, deleteFaculty, updateFaculty, createFaculty} = require('../controllers/facultyControllers');
const authenticate = require('../middleware/auth');
const router = express.Router();



//other routes
router.get("/all",authenticate, getAllFaculty)
router.get("/me/:id",authenticate, getMyFaculty)
router.get("/:id",authenticate, deleteFaculty)
router.get("/:id", authenticate,updateFaculty)
router.post("/", createFaculty)


module.exports = router;
