export interface Card {
  _id: string
  title: string
  description?: string
  listId: string
  boardId: string
  position: number
  memberIds: string[]
  createdAt: string
}

export interface CreateCardDTO {
  title: string
  listId: string
  boardId: string
}

export interface UpdateCardDTO {
  title?: string
  description?: string
  listId?: string
  position?: number
}
