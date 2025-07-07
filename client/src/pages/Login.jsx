import { Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from '@/services/api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"





export default function Login() {
   
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    const [loading, setLoading ] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () =>{
        if (!password.trim() || !email.trim()) return alert("All fields are Required")
        setLoading(true)
        
        try {
            const payload = {password, email}
            const res = await API.post("/auth/login", payload)
            localStorage.setItem("token", res.data.token)
            //window.location.href="/dashboard"
            navigate("/dashboard")

        } catch (error) {
            alert(error.response?.data?.message || "Login Failed")
        }finally{
            setLoading(false)
        }

        

        
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-100">
            <Card className="w-full max-w-md animate shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Login Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleLogin} className="w-full">
                      { loading ? "Logging In..." : "Login" }
                    </Button>
                </CardFooter>
                <p className="text-sm text-center text-zinc-500 dark:text-zinc-300 mt-4 ">Don't have an Account? 
                    <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
            </Card>
        </div>
    )
}
