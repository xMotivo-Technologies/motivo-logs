import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Attach the stored access token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Access tokens expire after 45 minutes. On a 401, try the refresh-token
// cookie once to get a new one and replay the request, instead of just
// failing. Concurrent 401s while a refresh is already in flight wait for
// that same refresh rather than firing their own.
let isRefreshing = false
let pendingRequests = []

const resolvePendingRequests = (error, token) => {
  pendingRequests.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  pendingRequests = []
}

const forceLogout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint = originalRequest?.url?.includes('/refresh-token') || originalRequest?.url?.includes('/login')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh-token`,
          {},
          { withCredentials: true },
        )
        localStorage.setItem('accessToken', data.accessToken)
        resolvePendingRequests(null, data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        resolvePendingRequests(refreshError, null)
        forceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Normalize errors so callers can just read err.message.
    const message = error.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  },
)

export default api
