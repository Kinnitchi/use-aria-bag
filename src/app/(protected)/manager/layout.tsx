import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { ManagerSidebar } from "./_components/manager-sidebar";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
