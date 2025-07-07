import axios from 'axios'

const baseURL = 'https://schoolmanagement-jt8e.onrender.com/api'
const API = axios.create({ baseURL })

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default API
