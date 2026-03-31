import { z } from "zod";

export const updateAddressSchema = z.object({
  phone: z.string().max(20).optional(),
  addressZipCode: z.string().max(9).optional(),
  addressStreet: z.string().max(200).optional(),
  addressNumber: z.string().max(20).optional(),
  addressComplement: z.string().max(100).optional(),
  addressNeighborhood: z.string().max(100).optional(),
  addressCity: z.string().max(100).optional(),
  addressState: z.string().max(2).optional(),
});
