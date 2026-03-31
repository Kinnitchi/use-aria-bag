import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { ManagerSidebar } from "./_components/manager-sidebar";
import { logSecurityEvent } from "@/src/lib/logger";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });

  if (!session || session.user.role !== "admin") {
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
    logSecurityEvent("AUTH_UNAUTHORIZED", "warn", {
      userId: session?.user?.id ?? "anonymous",
      ip,
      details: { context: "manager-layout" },
    });
    redirect("/");
  }

  logSecurityEvent("ADMIN_ACCESS", "info", { userId: session.user.id });

  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
