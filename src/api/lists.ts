import api from '@/utils/axios'
import type { List, CreateListDTO, UpdateListDTO } from '@/types/list'

export const listsApi = {
  create: (data: CreateListDTO) => api.post<List>('/lists', data),

  getByBoard: (boardId: string) => api.get<List[]>(`/lists/board/${boardId}`),

  update: (id: string, data: UpdateListDTO) => api.patch<List>(`/lists/${id}`, data),

  delete: (id: string) => api.delete(`/lists/${id}`),
}
