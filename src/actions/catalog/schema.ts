import { z } from "zod";

const imageUrlSchema = z
  .string()
  .min(1, "URL da imagem é obrigatória")
  .refine(
    (val) => val.startsWith("/") || /^https:\/\/.+/.test(val),
    "A imagem deve ser uma URL HTTPS válida ou um caminho relativo começando com /"
  );

export const createModelSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .min(1, "Descrição curta é obrigatória")
    .max(100, "Descrição curta deve ter no máximo 100 caracteres"),
  fullDescription: z
    .string()
    .min(1, "Descrição completa é obrigatória")
    .max(500, "Descrição completa deve ter no máximo 500 caracteres"),
  image: imageUrlSchema,
});

export const updateModelSchema = z.object({
  modelSlug: z.string().min(1).max(120),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória").max(100, "Descrição deve ter no máximo 100 caracteres"),
  fullDescription: z.string().max(500, "Descrição completa deve ter no máximo 500 caracteres"),
  image: imageUrlSchema,
});

export const addProductSchema = z.object({
  modelSlug: z.string().min(1).max(120),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero").max(9999.99, "Preço inválido"),
  colorName: z.string().min(1, "Cor é obrigatória").max(50, "Nome da cor deve ter no máximo 50 caracteres"),
});

export const updateProductSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  price: z.number().positive("Preço deve ser maior que zero").max(9999.99, "Preço inválido"),
  colorName: z.string().min(1, "Cor é obrigatória").max(50, "Nome da cor deve ter no máximo 50 caracteres"),
});

export const deleteProductSchema = z.object({
  productId: z.string().uuid(),
});
