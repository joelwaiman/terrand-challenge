import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título no puede tener más de 100 caracteres"),
  description: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede tener más de 500 caracteres"),
  ingredients: z.string().min(1, "Los ingredientes son requeridos").max(1000, "Los ingredientes no pueden tener más de 1000 caracteres"),
  imageUrl: z.string().optional(),
});

export type RecipeInput = z.infer<typeof recipeSchema>;

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

export type RatingInput = z.infer<typeof ratingSchema>;

