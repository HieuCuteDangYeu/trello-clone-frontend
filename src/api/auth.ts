import api from '@/utils/axios'
import type { LoginResponse, User } from '@/types/auth'

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', credentials),

  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),

  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),

  refreshToken: (refreshToken: string) =>
    api.post<LoginResponse>('/auth/refresh-token', { refreshToken }),

  googleLogin: (idToken: string) => api.post<LoginResponse>('/auth/google', { idToken }),

  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),

  getMe: () => api.get<User>('/auth/me'),
}
