import axios from 'axios'

const baseURL = 'https://schoolmanagement-jt8e.onrender.com/api';
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