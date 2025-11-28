import type { User } from '@/types/auth'
import type { Board } from '@/types/board'
import api from '@/utils/axios'

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const adminApi = {
  getUsers: (page = 1, limit = 10, search = '') =>
    api.get<PaginatedResult<User>>('/users', { params: { page, limit, q: search } }),

  getSystemBoards: (page = 1, limit = 10) =>
    api.get<PaginatedResult<Board>>('/boards/admin/all', { params: { page, limit } }),

  deleteUser: (userId: string) => api.delete(`/users/${userId}`),

  deleteBoard: (boardId: string) => api.delete(`/boards/${boardId}`),
}
