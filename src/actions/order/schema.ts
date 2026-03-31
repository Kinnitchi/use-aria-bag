import { z } from "zod";

/**
 * O cliente envia APENAS productId + quantity.
 * Preços são SEMPRE buscados no banco pelo servidor — nunca aceitos do cliente.
 * Isso previne Price Tampering (VULN-06).
 */
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid("ID de produto inválido"),
        quantity: z.number().int().min(1, "Quantidade mínima é 1").max(50, "Quantidade máxima é 50"),
      })
    )
    .min(1, "O carrinho está vazio")
    .max(20, "Máximo de 20 itens diferentes por pedido"),

  // Campos opcionais — para checkout de guest ou autenticado
  guestEmail: z.string().email("E-mail inválido").optional(),
  guestName: z.string().min(2).max(100).optional(),
  shippingAddress: z.string().max(500).optional(),
});
