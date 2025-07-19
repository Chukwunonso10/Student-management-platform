const express = require('express')
const authRoute = require('./Routes/authRoute')
const ConnectDB = require('./config/db')
const dotenv = require('dotenv')
const cors = require('cors')
const courseRoute = require('./Routes/courseRoute')
const departmentRoute = require('./Routes/departmentRoute')
const facultyRoute = require('./Routes/facultyRoute')
const lecturerRoute = require("./Routes/lecturerRoute")




dotenv.config()
ConnectDB();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}))


app.use('/api/auth', authRoute)
app.use('/api/course', courseRoute)
app.use('/api/department', departmentRoute)
app.use('/api/faculty', facultyRoute)
app.use('/api/lecturer', lecturerRoute)


// Catch-all route to serve React app
// app.use(express.static(path.join(__dirname, '../client/dist')))

// // Handle all other routes to return React index.html (for React Router)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'))
// })




app.listen(process.env.PORT, () =>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})
