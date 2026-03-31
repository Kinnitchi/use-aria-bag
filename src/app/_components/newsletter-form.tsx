"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { subscribeNewsletterAction } from "@/src/actions/newsletter/actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const { execute, isPending } = useAction(subscribeNewsletterAction, {
    onSuccess: () => {
      toast.success("Inscrição confirmada! Em breve você receberá nossas novidades.");
      setEmail("");
    },
    onError: ({ error }) => {
      const fieldError = error.validationErrors?.email?._errors?.[0];
      toast.error(fieldError ?? "Não foi possível realizar a inscrição. Tente novamente.");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    execute({ email });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu e-mail"
        required
        disabled={isPending}
        className="bg-background border-border focus:ring-accent/50 text-foreground placeholder:text-muted-foreground flex-1 rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 text-sm font-medium tracking-wide uppercase transition-colors disabled:opacity-60"
      >
        {isPending ? "Inscrevendo..." : "Inscrever"}
      </button>
    </form>
  );
}
