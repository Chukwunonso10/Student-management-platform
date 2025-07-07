import { useState, useEffect } from 'react'
import API from '@/services/api'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
    const [course, setCourse] = useState([])
    const [student, setStudent] = useState([])

    const LoadCourses = async () =>{
        const res = await API.get('/course')
        setCourse(res.data)
    }
    const LoadStudents = async () =>{
        const res = await API.get('/students/all')
        setStudent(res.data)
    }
   

    useEffect(() =>{ LoadCourses() }, [])
    useEffect(() =>{ LoadStudents() }, [])

    const createCourse = async (payload) => {
        const res = await API.post('/course', payload)
        setCourse(prev => [res.data, ...prev])
    }
    const createStudents = async (payload) => {
        const res = await API.post('/students', payload)
        setStudent(prev => [res.data, ...prev])
    }

    const updateCourse = async (code) => {
        const res = await API.put(`/course/${code}`, payload)
        setCourse(prev => [res.data, ...prev])
    }
    const updateStudent = async (regNo) => {
        const res = await API.put(`/course/${regNo}`, payload)
        setCourse(prev => [res.data, ...prev])
    }
    const deleteStudent = async (regNo) => {
        const res = await API.delete(`/course/${regNo}`)
        setStudent(prev => prev.filter(t => t.regNo !== regNo))
    }
    const deleteCourse = async (code) => {
        const res = await API.delete(`/course/${regNo}`)
        setCourse(prev => prev.filter(t => t.code !== code))
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        window.location.href = '/login';
        }

    return (
        <div>
            <Button positon="right" onClick={logout}>   Logout   </Button>
            <div className="max-w-5xl p-4 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="font-semibold text-green-900 dark:text-green-100" >Admin Dashboard</h2>
                        <p className="text-2xl font-bold">Manage Create, Delete, Update and search all information. Total Courses: </p>
                    </div>
                </div>
            </div>

          <div>
                        <h1 className="font-semibold text-green-900 "dark:text-green-100 >Access Your Courses Here </h1>
                        <p className="text-2xl font-bold"></p>
                    </div>
                    
                   
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    

                    </section>
                
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No Courses found. create the Course task to get started</p>
                        </div>

                    
                </div>
            
            
        
    )
}

            
                    
                  