import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Logout() {
    const navigate = useNavigate()

     const handleLogout = ()=>{
        localStorage.removeItem('token')
        navigate("/login")
    }
    return (
        <div>
            <Button onClick={handleLogout}>
                Logout
            </Button>
        </div>
    )
}