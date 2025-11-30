import { PUBLIC_ENDPOINTS } from '@/api/config'
import type { LoginResponse } from '@/types/auth'
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      if (token) prom.resolve(token)
    }
  })
  failedQueue = []
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    )

    if (isPublicEndpoint) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = Cookies.get('refreshToken')
      if (!refreshToken) throw new Error('No refresh token available')

      const baseURL = import.meta.env.VITE_BACKEND_URL || '/api'
      const isProduction = window.location.protocol === 'https:'

      const { data } = await axios.post<LoginResponse>(`${baseURL}/auth/refresh-token`, {
        refreshToken,
      })

      Cookies.set('accessToken', data.accessToken, {
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
      })
      Cookies.set('refreshToken', data.refreshToken, {
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
      })

      processQueue(null, data.accessToken)

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest)
    } catch (refreshError: unknown) {
      processQueue(refreshError, null)
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
