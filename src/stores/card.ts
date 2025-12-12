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
    const destList = cards.value[toListId]
    const card = destList?.find((c) => c._id === cardId)

    const oldListId = card?.listId
    const oldPosition = card?.position

    if (card) {
      card.listId = toListId
      card.position = newPosition
    }

    try {
      await cardsApi.update(cardId, {
        listId: toListId,
        position: newPosition,
      })
    } catch (error) {
      if (card && oldListId && oldPosition) {
        card.listId = oldListId
        card.position = oldPosition
      }
      const listKeys = Object.keys(cards.value)
      listKeys.forEach((id) => fetchCardsForList(id))

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
