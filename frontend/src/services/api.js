import axios from 'axios'

// Authenticated API — adds JWT Bearer token to every request
const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('jwt_user')
      localStorage.removeItem('sentinel_auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Public auth API — no token needed
export const authApi = axios.create({ baseURL: '/auth' })
