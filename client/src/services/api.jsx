import axios from 'axios'

const baseURL = `${import.meta.env.VITE_API_BASE_URL}`

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
