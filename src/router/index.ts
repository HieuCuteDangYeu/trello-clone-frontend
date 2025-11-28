import { useAuthStore } from '@/stores/auth'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ForgotPasswordPage from '@/views/auth/ForgotPasswordPage.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue'
import ResetPasswordPage from '@/views/auth/ResetPasswordPage.vue'
import VerifyEmailPage from '@/views/auth/VerifyEmailPage.vue'
import BoardDetail from '@/views/boards/BoardDetail.vue'
import BoardsPage from '@/views/boards/BoardsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/boards',
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordPage,
      meta: { guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPasswordPage,
      meta: { guestOnly: true },
    },
    {
      path: '/verify-email',
      alias: '/verify-email',
      name: 'VerifyEmail',
      component: VerifyEmailPage,
      meta: { guestOnly: true },
    },
    {
      path: '/boards',
      name: 'Boards',
      component: BoardsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/boards/:id',
      name: 'BoardDetail',
      component: BoardDetail,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.accessToken && !authStore.user) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.requiresAdmin) {
    if (authStore.user?.role !== 'admin') {
      return next('/boards')
    }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/boards')
  }

  next()
})

export default router
