// //utility function for authentication

// export const decodeToken = (token)=>{
//     try {
//         const payload = JSON.parse(atob(token.split(".")[1]))
//         return payload
//     } catch (error) {
//        console.error("Error decoding token: ",error) 
//        return null;
//     }
// }

// export const getUserFromToken = () =>{
//     const token = localStorage.getItem("token")
//     if (!token) return null

//     return decodeToken(token)
// }




