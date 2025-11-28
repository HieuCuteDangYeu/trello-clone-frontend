import api from '@/utils/axios'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/auth'
import type { PaginatedResponse } from '@/types/common'

export const usersApi = {
  getAll: (page = 1, limit = 10, q?: string) =>
    api.get<PaginatedResponse<User>>(`/users`, { params: { page, limit, q } }),

  create: (data: CreateUserDTO) => api.post<User>('/users', data),

  update: (id: string, data: UpdateUserDTO) => api.patch<User>(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
}
