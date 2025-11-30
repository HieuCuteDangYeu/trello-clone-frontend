import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import type { LoginResponse, User } from '@/types/auth'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref(Cookies.get('accessToken') || '')
  const isAuthenticated = ref(!!Cookies.get('accessToken'))

  const isProduction = window.location.protocol === 'https:'

  function setTokens(data: LoginResponse) {
    accessToken.value = data.accessToken
    isAuthenticated.value = true
    Cookies.set('accessToken', data.accessToken, {
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      expires: 15 / (24 * 60),
    })
    Cookies.set('refreshToken', data.refreshToken, {
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      expires: 7,
    })
  }

  async function login(payload: { email: string; password: string }) {
    try {
      const { data } = await authApi.login(payload)
      setTokens(data)
      await fetchUser()
      return true
    } catch (error: unknown) {
      throw error
    }
  }

  async function register(payload: { email: string; username: string; password: string }) {
    try {
      await authApi.register(payload)
      return true
    } catch (error: unknown) {
      throw error
    }
  }

  async function googleLogin(idToken: string) {
    try {
      const { data } = await authApi.googleLogin(idToken)
      setTokens(data)
      await fetchUser()
      return true
    } catch (error: unknown) {
      throw error
    }
  }

  async function fetchUser() {
    if (!accessToken.value) return
    try {
      const { data } = await authApi.getMe()
      user.value = data
    } catch (error: unknown) {
      logout()
      throw error
    }
  }

  async function updateProfile(payload: { username?: string; email?: string }) {
    if (!user.value?._id) return
    try {
      const { data } = await usersApi.update(user.value._id, payload)
      user.value = { ...user.value, ...data }
    } catch (error: unknown) {
      throw error
    }
  }

  function logout() {
    user.value = null
    accessToken.value = ''
    isAuthenticated.value = false
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  }

  async function forgotPassword(email: string) {
    try {
      await authApi.forgotPassword(email)
    } catch (error: unknown) {
      throw error
    }
  }

  async function resetPassword(token: string, newPassword: string) {
    try {
      await authApi.resetPassword({ token, newPassword })
    } catch (error: unknown) {
      throw error
    }
  }

  async function verifyEmail(token: string) {
    try {
      await authApi.verifyEmail(token)
    } catch (error: unknown) {
      throw error
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    register,
    googleLogin,
    fetchUser,
    updateProfile,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
  }
})
