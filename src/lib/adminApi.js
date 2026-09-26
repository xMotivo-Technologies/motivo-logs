import axios from 'axios'

// Kept fully separate from the customer `api` client — its own token, its
// own storage key — so an admin session and a customer session never mix.
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminAccessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/admin/login')) {
      localStorage.removeItem('adminAccessToken')
      localStorage.removeItem('adminUser')
      window.location.href = '/admin/login'
    }

    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  },
)

export default adminApi
