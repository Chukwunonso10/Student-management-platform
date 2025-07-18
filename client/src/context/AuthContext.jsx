
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)


  useEffect(()=>{
    const saved = localStorage.getItem('user')
    if (saved){
    setUser(JSON.parse(saved))
    }
  }, [])

  const login = (userInfo)=>{
    localStorage.setItem("user", JSON.stringify(userInfo))
    setUser(userInfo)
  }


  const logout = ()=>{
    localStorage.removeItem("user")
    setUser(null)
    
  }

   
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//parses
