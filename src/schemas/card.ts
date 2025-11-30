import { z } from 'zod'

export const cardSchema = z.object({
  title: z.string().min(1, { message: 'Word is required' }),
  translation: z.string().min(1, { message: 'Translation is required' }),
  pronunciation: z.string().optional(),
  example: z.string().optional(),
})

export type CardSchema = z.infer<typeof cardSchema>
