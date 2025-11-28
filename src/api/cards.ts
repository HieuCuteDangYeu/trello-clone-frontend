import api from '@/utils/axios'
import type { Card, CreateCardDTO, UpdateCardDTO } from '@/types/card'

export const cardsApi = {
  create: (data: CreateCardDTO) => api.post<Card>('/cards', data),

  getByList: (listId: string) => api.get<Card[]>(`/cards/list/${listId}`),

  update: (id: string, data: UpdateCardDTO) => api.patch<Card>(`/cards/${id}`, data),

  delete: (id: string) => api.delete(`/cards/${id}`),
}
