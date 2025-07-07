const express = require('express')
const authRoute = require('./Routes/authRoute')
const studentRoute = require('./Routes/studentRoute')
const ConnectDB = require('./config/db')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const CourseRoute = require('./Routes/courseRoute')


dotenv.config()
ConnectDB();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/students', studentRoute)
app.use('/api/course', CourseRoute)


app.listen(process.env.PORT, () =>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})