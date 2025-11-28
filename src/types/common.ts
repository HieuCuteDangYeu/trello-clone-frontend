export interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: Meta
}

export interface ApiErrorResponse {
  message: string
  [key: string]: unknown
}
