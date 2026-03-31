"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { actionClient } from "@/src/lib/safe-action";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { authUserTable } from "@/src/db/schema";
import { updateAddressSchema } from "./schema";

export const updateAddressAction = actionClient
  .schema(updateAddressSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      throw new Error("Não autorizado");
    }

    await db
      .update(authUserTable)
      .set({
        phone: parsedInput.phone ?? null,
        addressZipCode: parsedInput.addressZipCode ?? null,
        addressStreet: parsedInput.addressStreet ?? null,
        addressNumber: parsedInput.addressNumber ?? null,
        addressComplement: parsedInput.addressComplement ?? null,
        addressNeighborhood: parsedInput.addressNeighborhood ?? null,
        addressCity: parsedInput.addressCity ?? null,
        addressState: parsedInput.addressState ?? null,
      })
      .where(eq(authUserTable.id, session.user.id));
  });
