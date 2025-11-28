import { listsApi } from '@/api/lists'
import type { CreateListDTO, List } from '@/types/list'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useListStore = defineStore('list', () => {
  const lists = ref<List[]>([])

  async function fetchLists(boardId: string) {
    try {
      const { data } = await listsApi.getByBoard(boardId)
      lists.value = data
    } catch (error) {
      throw error
    }
  }

  async function createList(payload: CreateListDTO) {
    try {
      const { data } = await listsApi.create(payload)
      lists.value.push(data)
      return data
    } catch (error) {
      throw error
    }
  }

  async function deleteList(listId: string) {
    try {
      await listsApi.delete(listId)
      lists.value = lists.value.filter((l) => l._id !== listId)
    } catch (error) {
      throw error
    }
  }

  async function updateListTitle(listId: string, title: string) {
    const list = lists.value.find((l) => l._id === listId)
    if (!list) return
    const oldTitle = list.title
    list.title = title
    try {
      await listsApi.update(listId, { title })
    } catch (error) {
      list.title = oldTitle
      throw error
    }
  }

  async function moveList(listId: string, newPosition: number, oldPosition: number) {
    try {
      await listsApi.update(listId, { position: newPosition })
    } catch (error) {
      const currentIdx = lists.value.findIndex((l) => l._id === listId)

      if (currentIdx !== -1) {
        const [movedList] = lists.value.splice(currentIdx, 1)

        if (movedList) {
          lists.value.splice(oldPosition, 0, movedList)
        }
      }
      throw error
    }
  }

  return {
    lists,
    fetchLists,
    createList,
    deleteList,
    updateListTitle,
    moveList,
  }
})
