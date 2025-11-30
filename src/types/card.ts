export interface Card {
  _id: string
  title: string
  translation: string
  example?: string
  pronunciation?: string
  listId: string
  boardId: string
  position: number
  memberIds: string[]
  createdAt: string
}

export interface CreateCardDTO {
  title: string
  translation: string
  example?: string
  pronunciation?: string
  listId: string
  boardId: string
}

export interface UpdateCardDTO {
  title?: string
  translation?: string
  example?: string
  pronunciation?: string
  listId?: string
  position?: number
}
