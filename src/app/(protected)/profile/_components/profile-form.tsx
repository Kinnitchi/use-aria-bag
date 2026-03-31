"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Lock, Eye, EyeOff, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PatternFormat, type NumberFormatValues } from "react-number-format";
import { useAction } from "next-safe-action/hooks";

import { authClient } from "@/src/lib/auth-client";
import { updateAddressAction } from "@/src/actions/profile/actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80, "Nome muito longo"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const addressSchema = z.object({
  phone: z.string().max(20).optional(),
  addressZipCode: z.string().max(9).optional(),
  addressStreet: z.string().max(200).optional(),
  addressNumber: z.string().max(20).optional(),
  addressComplement: z.string().max(100).optional(),
  addressNeighborhood: z.string().max(100).optional(),
  addressCity: z.string().max(100).optional(),
  addressState: z.string().max(2).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileFormProps {
  initialName: string;
  email: string;
  initialAddress: AddressFormData;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div className="bg-primary/10 border-border flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2">
      <span className="text-primary font-serif text-2xl font-medium">{initials || "?"}</span>
    </div>
  );
}

// ─── Eye toggle ───────────────────────────────────────────────────────────────

function PasswordInput({
  id,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} placeholder={placeholder} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────

function CardHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
        <div>
          <h2 className="text-foreground font-serif text-lg font-medium">{title}</h2>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
      </div>
      <Separator />
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileForm({ initialName, email, initialAddress }: ProfileFormProps) {
  const [currentName, setCurrentName] = useState(initialName);
  const [profileSaved, setProfileSaved] = useState(false);

  // ── Profile form ────────────────────────────────────────────────────────
  const {
    register: registerProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialName },
  });

  // ── Password form ────────────────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // ── Address form ─────────────────────────────────────────────────────────
  const {
    register: registerAddress,
    handleSubmit: handleAddress,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialAddress,
  });

  const { execute: saveAddress, isPending: isSavingAddress } = useAction(updateAddressAction, {
    onSuccess: () => toast.success("Endereço salvo com sucesso!"),
    onError: () => toast.error("Erro ao salvar endereço. Tente novamente."),
  });

  // ── Handlers ────────────────────────────────────────────────────────────

  async function onProfileSubmit(data: ProfileFormData) {
    const { error } = await authClient.updateUser({ name: data.name });
    if (error) {
      toast.error(error.message ?? "Erro ao atualizar perfil. Tente novamente.");
      return;
    }
    setCurrentName(data.name);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
    toast.success("Perfil atualizado com sucesso!");
  }

  async function onPasswordSubmit(data: PasswordFormData) {
    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: false,
    });
    if (error) {
      toast.error(error.message ?? "Senha atual incorreta. Tente novamente.");
      return;
    }
    resetPassword();
    toast.success("Senha alterada com sucesso!");
  }

  async function onAddressSubmit(data: AddressFormData) {
    saveAddress(data);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Avatar + info ───────────────────────────────────────────────── */}
      <div className="bg-card border-border flex items-center gap-5 rounded-xl border p-6">
        <AvatarInitials name={currentName} />
        <div className="min-w-0">
          <p className="text-foreground truncate font-serif text-xl font-medium">{currentName}</p>
          <p className="text-muted-foreground mt-0.5 truncate text-sm">{email}</p>
          <span className="bg-secondary text-muted-foreground mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium tracking-wide uppercase">
            Cliente
          </span>
        </div>
      </div>

      {/* ── Informações pessoais + Segurança (lado a lado) ──────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informações pessoais */}
        <div className="bg-card border-border rounded-xl border">
          <CardHeader icon={User} title="Informações pessoais" subtitle="Atualize seus dados de exibição" />
          <form onSubmit={handleProfile(onProfileSubmit)} className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <Input id="name" placeholder="Seu nome" {...registerProfile("name")} />
              {profileErrors.name && <p className="text-destructive text-xs">{profileErrors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed opacity-70"
              />
              <p className="text-muted-foreground text-xs">O e-mail não pode ser alterado.</p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSavingProfile}
                className="text-background hover:bg-ring/90 min-w-35 cursor-pointer rounded-sm px-6 py-2 text-sm tracking-wider uppercase"
              >
                {isSavingProfile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : profileSaved ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : null}
                {isSavingProfile ? "Salvando..." : profileSaved ? "Salvo!" : "Salvar"}
              </Button>
            </div>
          </form>
        </div>

        {/* Segurança */}
        <div className="bg-card border-border rounded-xl border">
          <CardHeader icon={Lock} title="Segurança" subtitle="Altere sua senha de acesso" />
          <form onSubmit={handlePassword(onPasswordSubmit)} className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Senha atual
              </Label>
              <PasswordInput id="currentPassword" placeholder="••••••••" {...registerPassword("currentPassword")} />
              {passwordErrors.currentPassword && (
                <p className="text-destructive text-xs">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                Nova senha
              </Label>
              <PasswordInput
                id="newPassword"
                placeholder="Mínimo 8 caracteres"
                {...registerPassword("newPassword")}
              />
              {passwordErrors.newPassword && (
                <p className="text-destructive text-xs">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar nova senha
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Repita a nova senha"
                {...registerPassword("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-destructive text-xs">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSavingPassword}
                className="text-background hover:bg-ring/90 min-w-40 cursor-pointer rounded-sm px-6 py-2 text-sm tracking-wider uppercase"
              >
                {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingPassword ? "Alterando..." : "Alterar senha"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Endereço de entrega (largura total) ─────────────────────────── */}
      <div className="bg-card border-border rounded-xl border">
        <CardHeader icon={MapPin} title="Endereço de entrega" subtitle="Usado para calcular o frete e enviar seus pedidos" />
        <form onSubmit={handleAddress(onAddressSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Telefone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone / WhatsApp
              </Label>
              <PatternFormat
                id="phone"
                format="(##) #####-####"
                mask="_"
                placeholder="(11) 99999-9999"
                customInput={Input}
                onValueChange={(v: NumberFormatValues) => setAddressValue("phone", v.value)}
                defaultValue={initialAddress.phone}
              />
              {addressErrors.phone && <p className="text-destructive text-xs">{addressErrors.phone.message}</p>}
            </div>

            {/* CEP */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addressZipCode" className="text-sm font-medium">
                CEP
              </Label>
              <PatternFormat
                id="addressZipCode"
                format="#####-###"
                mask="_"
                placeholder="00000-000"
                customInput={Input}
                onValueChange={(v: NumberFormatValues) => setAddressValue("addressZipCode", v.formattedValue)}
                defaultValue={initialAddress.addressZipCode}
              />
              {addressErrors.addressZipCode && (
                <p className="text-destructive text-xs">{addressErrors.addressZipCode.message}</p>
              )}
            </div>

            {/* Logradouro — ocupa 2 colunas */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="addressStreet" className="text-sm font-medium">
                Logradouro
              </Label>
              <Input id="addressStreet" placeholder="Rua, Av., Travessa..." {...registerAddress("addressStreet")} />
              {addressErrors.addressStreet && (
                <p className="text-destructive text-xs">{addressErrors.addressStreet.message}</p>
              )}
            </div>

            {/* Número */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addressNumber" className="text-sm font-medium">
                Número
              </Label>
              <Input id="addressNumber" placeholder="123" {...registerAddress("addressNumber")} />
              {addressErrors.addressNumber && (
                <p className="text-destructive text-xs">{addressErrors.addressNumber.message}</p>
              )}
            </div>

            {/* Complemento */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addressComplement" className="text-sm font-medium">
                Complemento <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input id="addressComplement" placeholder="Apto, Bloco, Casa..." {...registerAddress("addressComplement")} />
            </div>

            {/* Bairro */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addressNeighborhood" className="text-sm font-medium">
                Bairro
              </Label>
              <Input id="addressNeighborhood" placeholder="Seu bairro" {...registerAddress("addressNeighborhood")} />
              {addressErrors.addressNeighborhood && (
                <p className="text-destructive text-xs">{addressErrors.addressNeighborhood.message}</p>
              )}
            </div>

            {/* Cidade */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
              <Label htmlFor="addressCity" className="text-sm font-medium">
                Cidade
              </Label>
              <Input id="addressCity" placeholder="São Paulo" {...registerAddress("addressCity")} />
              {addressErrors.addressCity && (
                <p className="text-destructive text-xs">{addressErrors.addressCity.message}</p>
              )}
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addressState" className="text-sm font-medium">
                Estado (UF)
              </Label>
              <Input
                id="addressState"
                placeholder="SP"
                maxLength={2}
                className="uppercase"
                {...registerAddress("addressState")}
              />
              {addressErrors.addressState && (
                <p className="text-destructive text-xs">{addressErrors.addressState.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isSavingAddress}
              className="text-background hover:bg-ring/90 min-w-40 cursor-pointer rounded-sm px-6 py-2 text-sm tracking-wider uppercase"
            >
              {isSavingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSavingAddress ? "Salvando..." : "Salvar endereço"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
