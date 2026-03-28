import { z } from "zod";

export const updateModelSchema = z.object({
  modelSlug: z.string().min(1),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  fullDescription: z.string(),
  image: z.string().min(1, "Caminho da imagem é obrigatório"),
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
