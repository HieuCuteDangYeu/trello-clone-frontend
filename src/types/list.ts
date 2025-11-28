export interface List {
  _id: string
  title: string
  boardId: string
  position: number
  createdAt: string
}

export interface CreateListDTO {
  title: string
  boardId: string
}

export interface UpdateListDTO {
  title?: string
  position?: number
}
