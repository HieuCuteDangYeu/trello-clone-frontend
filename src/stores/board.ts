import { boardsApi } from '@/api/boards'
import type { Board, CreateBoardDTO } from '@/types/board'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useBoardStore = defineStore('board', () => {
  const boards = ref<Board[]>([])
  const currentBoard = ref<Board | null>(null)
  const isLoading = ref(false)

  async function fetchBoards() {
    isLoading.value = true
    try {
      const { data } = await boardsApi.getAll()
      boards.value = data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createBoard(payload: CreateBoardDTO) {
    try {
      const { data } = await boardsApi.create(payload)
      boards.value.unshift(data)
      toast.success('Board created successfully!')
      return data
    } catch (error) {
      throw error
    }
  }

  async function fetchBoard(boardId: string) {
    isLoading.value = true
    currentBoard.value = null
    try {
      const { data } = await boardsApi.getById(boardId)
      currentBoard.value = data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateBoard(
    boardId: string,
    payload: { title?: string; description?: string; language?: string },
  ) {
    try {
      const board = boards.value.find((b) => b._id === boardId)
      if (board) {
        if (payload.title) board.title = payload.title
        if (payload.description) board.description = payload.description
        if (payload.language) board.language = payload.language
      }
      await boardsApi.update(boardId, payload)
    } catch (error) {
      throw error
    }
  }

  async function deleteBoard(id: string) {
    try {
      await boardsApi.delete(id)
      boards.value = boards.value.filter((b) => b._id !== id)
    } catch (error) {
      throw error
    }
  }

  return {
    boards,
    currentBoard,
    isLoading,
    fetchBoards,
    createBoard,
    fetchBoard,
    updateBoard,
    deleteBoard,
  }
})
