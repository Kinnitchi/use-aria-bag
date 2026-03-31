import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1, "URL da imagem é obrigatória")
  .refine(
    (val) => val.startsWith("/") || /^https:\/\/.+/.test(val),
    "A imagem deve ser uma URL HTTPS válida ou um caminho relativo começando com /"
  );

export const createModelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição curta é obrigatória"),
  fullDescription: z.string().min(1, "Descrição completa é obrigatória"),
  image: imageUrlSchema,
});

export const updateModelSchema = z.object({
  modelSlug: z.string().min(1),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  fullDescription: z.string(),
  image: imageUrlSchema,
});

export const addProductSchema = z.object({
  modelSlug: z.string().min(1),
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().positive("Preço deve ser maior que zero"),
  colorName: z.string().min(1, "Cor é obrigatória"),
});

export const updateProductSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().positive("Preço deve ser maior que zero"),
  colorName: z.string().min(1, "Cor é obrigatória"),
});

export const deleteProductSchema = z.object({
  productId: z.string().uuid(),
});
