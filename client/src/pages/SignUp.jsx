import { Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import {  useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import API from '@/services/api'
import { Eye, EyeOff } from 'lucide-react'
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"




export default function SignUp() {
    const [firstName, setfirstName ] = useState("")
    const [lastName, setLastName ] = useState("")
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    const [departmentName, setDepartmentName ] = useState("")
    const [facultyName, setFacultyName] = useState("")
    const [loading, setLoading ] = useState(false)
    const [showPassword, setShowPassword ] = useState(false)
    const {user, setUser } = useContext(AuthContext)
    
    
    const navigate = useNavigate()

    const handleSignUp = async () =>{
        if (!firstName.trim() || !lastName.trim() || !password.trim() || !email.trim() || !departmentName.trim() || !facultyName.trim()) return alert("All fields are Required")
        setLoading(true)
        
        try {
            let payload = { firstName, lastName, facultyName, departmentName, email, password }
            console.log(payload)
            const res = await API.post("/auth/register", payload)
            setUser(res.data.user)
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            setfirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setDepartmentName("")
            setFacultyName("")
            alert("user successfully created")
            console.log(res.data?.user.role)
            navigate(res.data?.user?.role === "student" ? "/admin" : "/admin")
            

        } catch (error) {
            console.log("signup error:", error)
            alert(error.response?.data?.message || "Signup Failed")
        }finally{
            setLoading(false)
        }

        
    }
    

    return (
        <div className="flex flex-1 flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            
            
            <Card className="w-full max-w-md animate shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Student Registration Portal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                    type="text"
                    placeholder="first Name"
                    value={firstName}
                    onChange={e=> setfirstName(e.target.value)}
                    />
                    <Input
                    type="text"
                    placeholder="last Name"
                    value={lastName}
                    onChange={e=> setLastName(e.target.value)}
                    />
                    <Input
                    type="text"
                    placeholder="Department Name"
                    value={departmentName}
                    onChange={e=> setDepartmentName(e.target.value)}
                    />
                    <Input
                    type="text"
                    placeholder="faculty Name"
                    value={facultyName}
                    onChange={e=> setFacultyName(e.target.value)}
                    />
                    <Input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                    <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        value={password}
                        onChange={e=> setPassword(e.target.value)}
                    />
                    <Button variant="ghost" size="sm" className="absolute right-2 top-2 " onClick={()=>setShowPassword(prev => !prev)}>
                        {showPassword ? <Eye size={10}/> : <EyeOff size={10}/>}
                    </Button>
                    
                    </div>
                    
                    
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleSignUp} className="w-full">
                      { loading ? "Signing Up..." : "Sign Up" }
                    </Button>
                </CardFooter>
                <p className="text-sm text-center text-zinc-500 dark:text-zinc-300 mt-4 ">Aleady have an Account? 
                    <Link to="/" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </Card>
        </div>
    )
}
