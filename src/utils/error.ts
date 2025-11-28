import axios from 'axios'
import type { ApiErrorResponse } from '@/types/common'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined
    if (data && typeof data.message === 'string') {
      return data.message
    }
    if (error.response?.status === 401) return 'Unauthorized access.'
    if (error.response?.status === 403) return 'Permission denied.'
    if (error.response?.status === 404) return 'Resource not found.'
    if (error.response?.status === 500) return 'Server error. Please try again later.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
