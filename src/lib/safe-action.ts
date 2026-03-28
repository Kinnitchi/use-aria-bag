import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";

export const actionClient = createSafeActionClient();

export const adminActionClient = createSafeActionClient().use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    throw new Error("Não autorizado");
  }

  return next({ ctx: { session } });
});
