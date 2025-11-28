export interface Board {
  _id: string
  title: string
  description?: string
  ownerId: string
  isPrivate: boolean
  memberIds: string[]
  createdAt: string
}

export interface CreateBoardDTO {
  title: string
  description?: string
  isPrivate?: boolean
}

export interface UpdateBoardDTO {
  title?: string
  description?: string
  isPrivate?: boolean
}
