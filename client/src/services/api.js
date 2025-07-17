import axios from 'axios'

const baseURL = "http://localhost:5000/api"

const API = axios.create({ baseURL })


API.interceptors.request.use(config => {
    try {
        const token = localStorage.getItem("token")
        if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
    } catch (error) {
        return Promise.reject(error)
    }
})

export default API;