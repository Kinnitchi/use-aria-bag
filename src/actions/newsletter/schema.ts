import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido").max(254, "E-mail deve ter no máximo 254 caracteres").toLowerCase(),
});
