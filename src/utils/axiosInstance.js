import axios from 'axios'
import authStorage from './authStorage'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthEndpoint =
      originalRequest.url.includes('/refresh-token') || originalRequest.url.includes('/logout')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => axiosInstance({ ...originalRequest }))
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const response = await axiosInstance.post('/api/v1/users/refresh-token')

        // Extract new access token from response if provided
        if (response.data?.data?.accessToken) {
          const newAccessToken = response.data.data.accessToken;
          authStorage.setToken(newAccessToken);
        }

        processQueue(null)
        return axiosInstance({ ...originalRequest })
      } catch (err) {
        processQueue(err, null)

        // Clear auth data on refresh failure
        if (typeof window !== 'undefined') {
          authStorage.removeToken();
          authStorage.removeUser();
          window.location.href = '/login'
        }

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
