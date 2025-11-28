import { adminApi } from '@/api/admin'
import type { User } from '@/types/auth'
import type { Board } from '@/types/board'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const userMeta = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const isUsersLoading = ref(false)
  const boards = ref<Board[]>([])
  const boardMeta = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const isBoardsLoading = ref(false)

  async function fetchUsers(page = 1, search = '') {
    isUsersLoading.value = true
    try {
      const { data } = await adminApi.getUsers(page, userMeta.value.limit, search)
      users.value = data.data
      userMeta.value = data.meta
    } catch (error) {
      throw error
    } finally {
      isUsersLoading.value = false
    }
  }

  async function deleteUser(userId: string) {
    try {
      await adminApi.deleteUser(userId)
      fetchUsers(userMeta.value.page)
    } catch (error) {
      throw error
    }
  }

  async function fetchSystemBoards(page = 1) {
    isBoardsLoading.value = true
    try {
      const { data } = await adminApi.getSystemBoards(page, boardMeta.value.limit)
      boards.value = data.data
      boardMeta.value = data.meta
    } catch (error) {
      throw error
    } finally {
      isBoardsLoading.value = false
    }
  }

  async function deleteBoard(boardId: string) {
    try {
      await adminApi.deleteBoard(boardId)
      fetchSystemBoards(boardMeta.value.page)
    } catch (error) {
      throw error
    }
  }

  return {
    users,
    userMeta,
    isUsersLoading,
    boards,
    boardMeta,
    isBoardsLoading,
    fetchUsers,
    deleteUser,
    fetchSystemBoards,
    deleteBoard,
  }
})
