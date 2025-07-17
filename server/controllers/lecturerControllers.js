const express = require("express")
const Lecturer = require("../models/LecturersModel")

// Get all lecturers
const getAllLecturers = async (req, res) => {
  try {
    const { departmentId, page = 1, limit = 10 } = req.query

    const query = { isActive: true }
    if (departmentId) query.department = departmentId

    const lecturers = await Lecturer.find(query)
                                                .populate("user", "name email")
                                                .populate("department", "name code")
                                                .limit(limit * 1)
                                                .skip((page - 1) * limit)
                                                .sort({ lastName: 1 })

    const total = await Lecturer.countDocuments(query)

    res.json({
      lecturers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get single lecturer
const getMyLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
                                                        .populate("user", "firstName, lastName,  email")
                                                        .populate("department", "name code faculty")

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    res.json(lecturer)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create lecturer (Admin only)
const createLecturer =  async (req, res) => {
  try {
    const lecturer = new Lecturer(req.body)
    await lecturer.save()
    res.status(201).json(lecturer)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Employee ID already exists" })
    } else {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }
}

// Update lecturer (Admin only)
const updateLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    res.json(lecturer)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete lecturer (Admin only)
const deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    res.json({ message: "Lecturer deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
    getAllLecturers,
    getMyLecturer,
    createLecturer,
    updateLecturer,
    deleteLecturer
}
