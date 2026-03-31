import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";

import { auth } from "@/src/lib/auth";
import type { AuthUser } from "@/src/lib/auth";
import { db } from "@/src/db";
import { authUserTable } from "@/src/db/schema";
import { Header } from "@/src/components/layout/header";
import { ProfileForm } from "./_components/profile-form";

export const metadata = {
  title: "Meu Perfil | Ária bags",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  console.log("session:", session);
  if (!session) {
    redirect("/authentication/login");
  }

  const userRecord = await db.query.authUserTable.findFirst({
    where: eq(authUserTable.id, session.user.id),
  });

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="container mx-auto max-w-5xl px-4 pt-28 pb-16 md:pt-32">
        {/* Navegação */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à loja
        </Link>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-foreground font-serif text-2xl font-medium md:text-3xl">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gerencie suas informações pessoais e segurança</p>
        </div>

        <ProfileForm
          initialName={session.user.name}
          email={session.user.email}
          role={(session.user as AuthUser).role ?? "customer"}
          initialAddress={{
            phone: userRecord?.phone ?? "",
            addressZipCode: userRecord?.addressZipCode ?? "",
            addressStreet: userRecord?.addressStreet ?? "",
            addressNumber: userRecord?.addressNumber ?? "",
            addressComplement: userRecord?.addressComplement ?? "",
            addressNeighborhood: userRecord?.addressNeighborhood ?? "",
            addressCity: userRecord?.addressCity ?? "",
            addressState: userRecord?.addressState ?? "",
          }}
        />
      </div>
    </main>
  );
}
