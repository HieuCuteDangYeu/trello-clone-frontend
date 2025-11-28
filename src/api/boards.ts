import api from '@/utils/axios'
import type { Board, CreateBoardDTO, UpdateBoardDTO } from '@/types/board'
import type { PaginatedResponse } from '@/types/common'

export const boardsApi = {
  create: (data: CreateBoardDTO) => api.post<Board>('/boards', data),

  getAll: () => api.get<Board[]>('/boards'),

  getById: (id: string) => api.get<Board>(`/boards/${id}`),

  update: (id: string, data: UpdateBoardDTO) => api.patch<Board>(`/boards/${id}`, data),

  delete: (id: string) => api.delete(`/boards/${id}`),

  getSystemAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Board>>(`/boards/admin/all?page=${page}&limit=${limit}`),
}
