import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";
import { logSecurityEvent } from "./logger";

export const actionClient = createSafeActionClient();

export const adminActionClient = createSafeActionClient().use(async ({ next }) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session || session.user.role !== "admin") {
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
    logSecurityEvent("AUTH_UNAUTHORIZED", "warn", {
      userId: session?.user?.id ?? "anonymous",
      ip,
      details: { context: "server-action" },
    });
    throw new Error("Não autorizado");
  }

  return next({ ctx: { session } });
});
