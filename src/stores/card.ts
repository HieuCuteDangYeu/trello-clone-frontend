import { cardsApi } from '@/api/cards'
import type { Card, CreateCardDTO, UpdateCardDTO } from '@/types/card'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCardStore = defineStore('card', () => {
  const cards = ref<Record<string, Card[]>>({})

  async function fetchCardsForList(listId: string) {
    try {
      const { data } = await cardsApi.getByList(listId)
      cards.value[listId] = data
    } catch (error) {
      throw error
    }
  }

  async function createCard(payload: CreateCardDTO) {
    try {
      const { data } = await cardsApi.create(payload)
      if (!cards.value[payload.listId]) {
        cards.value[payload.listId] = []
      }
      cards.value[payload.listId]?.push(data)
    } catch (error) {
      throw error
    }
  }

  async function updateCard(cardId: string, payload: UpdateCardDTO) {
    try {
      const { data: updatedCard } = await cardsApi.update(cardId, payload)

      for (const listId in cards.value) {
        const list = cards.value[listId]
        if (!list) continue

        const index = list.findIndex((c) => c._id === cardId)
        if (index !== -1) {
          list[index] = updatedCard
          break
        }
      }
    } catch (error) {
      throw error
    }
  }

  async function deleteCard(cardId: string) {
    try {
      await cardsApi.delete(cardId)
      for (const listId in cards.value) {
        const list = cards.value[listId]
        if (list) {
          cards.value[listId] = list.filter((c) => c._id !== cardId)
        }
      }
    } catch (error) {
      throw error
    }
  }

  async function moveCard(cardId: string, toListId: string, newPosition: number) {
    try {
      const { data: updatedCard } = await cardsApi.update(cardId, {
        listId: toListId,
        position: newPosition,
      })

      for (const listId in cards.value) {
        const list = cards.value[listId]
        if (!list) continue

        const index = list.findIndex((c) => c._id === cardId)
        if (index !== -1) {
          list.splice(index, 1)
          break
        }
      }

      if (!cards.value[toListId]) {
        cards.value[toListId] = []
      }

      cards.value[toListId]?.splice(newPosition, 0, updatedCard)
    } catch (error) {
      throw error
    }
  }

  return {
    cards,
    fetchCardsForList,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
  }
})
