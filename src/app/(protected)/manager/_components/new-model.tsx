"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { createModelAction } from "@/src/actions/catalog/actions";
import { useCatalog } from "@/src/contexts/catalog-context";

const EMPTY = { name: "", description: "", fullDescription: "", image: "" };

export function NewModel() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState(EMPTY);
  const { addModel } = useCatalog();

  const { execute, isPending } = useAction(createModelAction, {
    onSuccess: ({ data }) => {
      addModel({
        id: data!.modelId,
        name: fields.name.trim(),
        description: fields.description.trim(),
        fullDescription: fields.fullDescription.trim(),
        image: fields.image.trim(),
        count: 0,
      });
      toast.success(`Modelo "${fields.name.trim()}" criado com sucesso.`);
      setFields(EMPTY);
      setOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erro ao criar modelo. Tente novamente.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    execute({
      name: fields.name.trim(),
      description: fields.description.trim(),
      fullDescription: fields.fullDescription.trim(),
      image: fields.image.trim(),
    });
  }

  function handleChange(key: keyof typeof EMPTY) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  return (
    <div className="flex justify-end">
      <Button onClick={() => setOpen(true)} size="sm" className="bg-accent hover:bg-ring gap-2">
        <Plus className="size-4" />
        Novo Modelo
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!isPending) {
            setOpen(v);
            if (!v) setFields(EMPTY);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-medium">Novo Modelo</DialogTitle>
          </DialogHeader>

          <form id="new-model-form" onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nm-name">Nome</Label>
              <Input
                id="nm-name"
                placeholder="ex: Classic Tote"
                value={fields.name}
                onChange={handleChange("name")}
                disabled={isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nm-description">Descrição curta</Label>
              <Input
                id="nm-description"
                placeholder="Uma linha descrevendo o modelo"
                value={fields.description}
                onChange={handleChange("description")}
                disabled={isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nm-full-description">Descrição completa</Label>
              <Textarea
                id="nm-full-description"
                placeholder="Detalhes sobre materiais, dimensões, características..."
                rows={4}
                value={fields.fullDescription}
                onChange={handleChange("fullDescription")}
                disabled={isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nm-image">URL da imagem</Label>
              <Input
                id="nm-image"
                placeholder="/images/modelo.jpg"
                value={fields.image}
                onChange={handleChange("image")}
                disabled={isPending}
                required
              />
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFields(EMPTY);
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" form="new-model-form" disabled={isPending}>
              {isPending ? "Criando…" : "Criar Modelo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
