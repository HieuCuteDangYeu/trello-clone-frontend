export interface User {
  _id: string
  email: string
  username: string
  roleId: string
  role: string
  isEmailVerified: boolean
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface CreateUserDTO {
  username: string
  email: string
  password: string
}

export interface UpdateUserDTO {
  username?: string
  email?: string
}
