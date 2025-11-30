import { z } from 'zod'

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(50, { message: 'Title cannot exceed 50 characters' }),
  description: z.string().optional(),
  language: z.string().optional().default('US English Male'),
  isPrivate: z.boolean().optional().default(true),
})

export type CreateBoardSchema = z.infer<typeof createBoardSchema>
