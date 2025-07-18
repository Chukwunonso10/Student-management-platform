import { Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from '@/services/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from 'lucide-react'
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"



export default function Login() {
   
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    const [showPassword, setShowPassword ] = useState(false)
    const [loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)


    const handleLogin = async () =>{
        if (!password.trim() || !email.trim()) return alert("All fields are Required")
        setLoading(true)
        
        try {
            const payload = {password, email}
            const res = await API.post("/auth/login", payload)
            setUser(res.data.user)
            localStorage.setItem("token", res.data.token)
            alert("Login Successful")
            navigate(res.data?.user?.role === "student" ? "/admin" : "/admin")
            

        } catch(error) {
            alert(error.response?.data?.message || "Login Failed ")
        }finally{
            setLoading(false)
        }

        

        
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md animate shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Student Login page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                   <div className="relative">
                     <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <Button variant="ghost" size="18" className="absolute top-2 right-2" onClick={()=>setShowPassword(prev => !prev)}>
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </Button>
                   </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleLogin} className="w-full">
                      { loading ? "Logging In..." : "Login" }
                    </Button>
                </CardFooter>
                <p className="text-sm text-center text-zinc-500 dark:text-zinc-300 mt-4 ">Don't have an Account? 
                    <Link to="/register" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
            </Card>
        </div>
    )
}
