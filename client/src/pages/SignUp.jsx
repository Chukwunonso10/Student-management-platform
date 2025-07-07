import { Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from '@/services/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'




export default function SignUp() {
    const [firstName, setFirstName ] = useState("")
    const [lastName, setLastName ] = useState("")
    const [password, setPassword ] = useState("")
    const [email, setEmail ] = useState("")
    const [facultyName, setFacultyName ] = useState("")
    const [departmentName, setDepartment ] = useState("")
    const [loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = async () =>{
        console.log("clicked sign up")
        if (!firstName.trim() || !lastName.trim() || !password.trim() || !email.trim() || !facultyName.trim() || !departmentName.trim()) return alert("All fields are Required")
        setLoading(true)
        
        try {
            const payload = {firstName, lastName, password, email, facultyName, departmentName}
            const res = await API.post("/auth/register", payload)
            localStorage.setItem("token", res.data.token)
            //window.location.href="/dashboard"
            navigate("/Dashboard")

        } catch (error) {
            console.log("signup error:", error)
            alert(error.response?.data?.message || "Signup Failed")
        }finally{
            setLoading(false)
        }

        
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-100">
            <Card className="w-full max-w-md animate shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Registration Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                    type="text"
                    placeholder="FirstName"
                    value={firstName}
                    onChange={e=> setFirstName(e.target.value)}
                    />
                    <Input
                    type="text"
                    placeholder="LastName"
                    value={lastName}
                    onChange={(e)=>setLastName(e.target.value)}
                    />
                    <Input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Input 
                    type="text"
                    placeholder="departmentName"
                    value={departmentName}
                    onChange={(e)=>setDepartment(e.target.value)}
                    />
                    <Input 
                    type="text"
                    placeholder="facultyName"
                    value={facultyName}
                    onChange={(e)=>setFacultyName(e.target.value)}
                    />
                    
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleSignUp} className="w-full">
                      { loading ? "Signing Up..." : "Sign Up" }
                    </Button>
                </CardFooter>
                <p className="text-sm text-center text-zinc-500 dark:text-zinc-300 mt-4 ">Aleady have an Account? 
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </Card>
        </div>
    )
}
