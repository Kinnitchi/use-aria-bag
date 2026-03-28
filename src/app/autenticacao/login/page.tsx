"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { signIn } from "@/src/lib/auth-client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    const { error } = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message ?? "Credenciais inválidas. Tente novamente.");
      setIsLoading(false);
      return;
    }

    toast.success("Bem-vinda de volta!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — imagem/branding */}
      <div className="hidden flex-col items-center justify-center gap-6 bg-[url('/images/auth-bg.jpg')] bg-cover bg-center md:flex md:w-1/2">
        <div className="bg-background/60 flex flex-col items-center gap-3 rounded-2xl px-10 py-8 backdrop-blur-sm">
          <span className="text-foreground font-serif text-4xl font-semibold tracking-wider">Ária bags</span>
          <p className="text-muted-foreground text-center text-sm">
            Bolsas de luxo artesanais, criadas com os melhores materiais.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="mb-10 text-center md:hidden">
            <Link href="/" className="text-foreground font-serif text-3xl font-semibold tracking-wider">
              Ária bags
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-foreground font-serif text-2xl font-medium">Entrar na conta</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Não tem conta?{" "}
              <Link href="/autenticacao/cadastro" className="text-foreground underline-offset-4 hover:underline">
                Criar conta
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>

          <p className="text-muted-foreground mt-8 text-center text-xs">
            <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
              ← Voltar à loja
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
