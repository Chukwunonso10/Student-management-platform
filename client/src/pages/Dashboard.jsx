import { useState, useEffect } from 'react'
import API from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Logout from '@/components/logout'


export default function Dashboard() {
    const [loading, setLoading ] = useState(false)
    const [course, setCourse ] = useState([])
    const [newcourse, setNewCourse] = useState({
        title:"",
        unit: "",
        code: "",
        departmentName: ""
    })
   
    const LoadCourses = async () =>{
        try {
            setLoading(true)
            const res = await API.get('/course')
            setCourse(res.data)

        } catch (error) {
            alert("error loading Students", error.message)
        }
        finally{
            setLoading(false)
        }
    }
    

    useEffect(() =>{
        LoadCourses()
    }, [])




    const handleCreateCourse = async() => {
        try {
            setLoading(true)
            const res = await API.post('/course', newcourse )
            setCourse(prev => [res.data, ...prev])
            alert("Course created successfully")
            setNewCourse({title:"",unit:"", code:"", departmentName:""})
        } catch (error) {
            console.error(error.response?.data?.message)
        }
        finally{
            setLoading(false)
        }
    }

   

    return (
       
        <div className='min-h-screen m-4 p-4'>
            <div className='flex justify-end'>
                <Logout />
            </div>
         
             <div className="p-4 w-max-md">
                <h1 className="text-2xl font-bold text-center">Student Dashboard</h1>
            </div>
            <div className="my-4 w-full">
                <h2 className="font-semibold mb-2 text-center dark:text-gray-100">Create A New Course: </h2>
                <div className="grid grid-cols-2 gap-4 shadow-lg">
                    <Input
                    type="text"
                    placeholder="course Title"
                    value={newcourse.title}
                    onChange={(e)=>setNewCourse({...newcourse, title: e.target.value})}/>
                    <Input
                    type="Number"
                    placeholder="course Unit"
                    value={newcourse.unit}
                    onChange={(e)=>setNewCourse({...newcourse, unit: e.target.value})}/>
                    <Input
                    type="text"
                    placeholder="course code"
                    value={newcourse.code}
                    onChange={(e)=>setNewCourse({...newcourse, code: e.target.value})}/>
                    <Input
                    type="text"
                    placeholder="course Dept"
                    value={newcourse.departmentName}
                    onChange={(e)=>setNewCourse({...newcourse, departmentName: e.target.value})}/>
                </div>

                <div className="text-center mt-4 ">
                    <Button className="w-full cursor-pointer" onClick={handleCreateCourse} disabled={loading}>
                        {loading ?  "Creating..." : "Create"}
                    </Button>
                </div>

                    <div className="my-6">
                        <h2 className="font-semibold text-center mb-2 text-2xl">All Courses</h2>
                        <ul className="space-y-2">
                            {course.length ? (
                                 course.map((s, i) => (
                            <li key={i} className="border p-2 rounded h-20 flex items-center shadow-md">
                            {i+1}. {s.title} {s.code} {s.unit} {s.departmentName}
                            </li>
                        ))
                            ) : (
                                <p>No course Found</p>
                            )}
                        </ul>
                    </div>

            </div>
        </div>
    )
}




















































// export default function Dashboard() {
//     const [course, setCourse] = useState([])
//     const [student, setStudent] = useState([])

//     const LoadCourses = async () =>{
//         try {
//             const res = await API.get('/course')
//             setCourse(res.data)
//         } catch (error) {
//             alert("error loading courses", error.message)
//         }
//     }
//     const LoadStudents = async () =>{
//         try {
//             const res = await API.get('/students/all')
//             setStudent(res.data)
//         } catch (error) {
//             alert("error loading Students", error.message)
//         }
//     }
    
//     useEffect(()=>{
//         LoadCourses(),
//         LoadStudents()
//     }, [])

//     const handleCreateCourse = async () => {
//         const res = await API.post('/course', payload)
//         setCourse(prev => [res.data, ...prev])
//     }
//     const createStudents = async (payload) => {
//         const res = await API.post('/students', payload)
//         setStudent(prev => [res.data, ...prev])
//     }

//     const updateCourse = async (code) => {
//         const res = await API.put(`/course/${code}`, payload)
//         setCourse(prev => [res.data, ...prev])
//     }
//     const updateStudent = async (regNo) => {
//         const res = await API.put(`/course/${regNo}`, payload)
//         setCourse(prev => [res.data, ...prev])
//     }
//     const deleteStudent = async (regNo) => {
//         const res = await API.delete(`/course/${regNo}`)
//         setStudent(prev => prev.filter(t => t.regNo !== regNo))
//     }
//     const deleteCourse = async (code) => {
//         const res = await API.delete(`/course/${regNo}`)
//         setCourse(prev => prev.filter(t => t.code !== code))
//     }

//     const logout = ()=>{
//         localStorage.removeItem('token')
//         window.location.href = '/login';
//         }

//     return (
//         <div>
//             <Button positon="right" onClick={logout}>   Logout   </Button>
//             <div className="max-w-5xl p-4 mx-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <div>
//                         <h2 className="font-semibold text-green-900 dark:text-green-100" >Admin Dashboard</h2>
//                         <p className="text-2xl font-bold">Manage Create, Delete, Update and search all information. Total Courses: </p>

//                         <Button oncl>
//                             Total Course:
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//           <div>
//                         <h1 className="font-semibold text-green-900 "dark:text-green-100 >Access Your Courses Here </h1>
//                         <p className="text-2xl font-bold"></p>
//                     </div>
                    
                   
//                     <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    

//                     </section>
                
//                         <div className="text-center py-12">
//                             <p className="text-gray-500 dark:text-gray-400">No Courses found. create the Course task to get started</p>
//                         </div>

                    
//                 </div>
            
            
        
//     )
// }

            
                    
                  