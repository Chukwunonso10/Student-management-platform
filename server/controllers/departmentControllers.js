const Department = require('../models/DepartmentModel')
const Faculty = require('../models/FacultyModel')


const getAllDeparments = async (req,res) =>{
    const { facultyId } = req.query
    const query = { isActive: true }  //build the base filter object
    if (!facultyId) query.facultyId = facultyId

    const department = await Department.find(query)
                                            .populate("faculty", "name code")
                                            .populate("HOD", "title firstName lastName" )
                                            .sort({name: 1})
    if (department.length === 0 ) return res.status(200).json({message: "empty array"})
    res.status(200).json(department, { message: "successful"})
}

const getMyDeparment = async (req,res) =>{
    try {
        const { id } = req.params
        const department = await Department.findById(id)
                                            .populate("faculty", "name code")
                                            .populate("HOD", "title firstName lastName" )
                                            .sort({name: 1})
    if (!department ) return res.status(200).json({message: "department not found"})
    res.status(200).json(department, { message: "successful"})    
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }                                  
}

const createDepartment = async (req, res) =>{
    const { name, code, description, faculty } = req.body;
    try {
        const department = await Department.findOne({ name })
        if (department) return res.status(409).json({ message: "Department already exist"})
        
        const targetfaculty = await Faculty.findOne({ name: faculty })
        if (!targetfaculty) return res.status(409).json({message: "faculty doesn't already exists"})

        const newDepartment = await Department.create({
            name: name,
            code: code,
            description: description,
            faculty: faculty._id
    })

    if (!newDepartment) return res.status(500).json({ message: "Error creating department"})
    res.status(201).json({ message: "successfully created"})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

//soft delete
const deleteDepartment = async (req, res) =>{
    try {
        const { id } = req.params
        const department = await Department.findByIdAndUpdate({id}, {isActive: false}, {new: true})
        if (!department) return res.status(404).json({ message: "department not found "})
        res.status(200).json({ message: "Department deleted successfully"})
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
 }

 const updateDepartment = async (req, res) =>{
    try {
        const { id } = req.params
        const department = await Department.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if (!department) return res.status(404).json({ message: "department not found"})
        res.status(200).json(department)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }

 }

module.exports = {
    createDepartment,
    getAllDeparments,
    getMyDeparment,
    deleteDepartment,
    updateDepartment
}