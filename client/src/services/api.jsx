import axios from 'axios'

const baseURL = 'http://localhost:3000/api';
const API = axios.create({baseURL})


//for jwt
API.interceptors.request.use((config) =>{
    const token = localStorage.getItem('token')
    try {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            return config
        }
    } catch (error) {
        error.response?.data?.message
    }
})


export default API; 