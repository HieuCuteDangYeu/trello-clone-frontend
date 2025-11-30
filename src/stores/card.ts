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
      if (!cards.value[payload.listId]) cards.value[payload.listId] = []
      cards.value[payload.listId]!.push(data)
    } catch (error) {
      throw error
    }
  }

  async function updateCard(cardId: string, payload: UpdateCardDTO) {
    try {
      await cardsApi.update(cardId, payload)

      for (const listId in cards.value) {
        const card = cards.value[listId]!.find((c) => c._id === cardId)
        if (card) {
          if (payload.title) card.title = payload.title
          if (payload.translation) card.translation = payload.translation
          if (payload.example) card.example = payload.example
          if (payload.pronunciation) card.pronunciation = payload.pronunciation
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
        cards.value[listId] = cards.value[listId]!.filter((c) => c._id !== cardId)
      }
    } catch (error) {
      throw error
    }
  }

  async function moveCard(cardId: string, toListId: string, newPosition: number) {
    try {
      await cardsApi.update(cardId, { listId: toListId, position: newPosition })
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
