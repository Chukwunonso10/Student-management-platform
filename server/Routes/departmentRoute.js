const express = require('express')
const router = express.Router()
const { createDepartment, getAllDeparments, getMyDeparment, deleteDepartment, updateDepartment } = require('../controllers/departmentControllers');
const authenticate = require('../middleware/auth');



router.get('/all',authenticate, getAllDeparments);
router.get('/me:id', authenticate, getMyDeparment);
router.post('/', authenticate, createDepartment);
router.put('/:id', authenticate, updateDepartment);
router.delete('/:id', authenticate, deleteDepartment);

module.exports = router;