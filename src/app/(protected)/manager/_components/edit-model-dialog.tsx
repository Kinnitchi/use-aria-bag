"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useCatalog } from "@/src/contexts/catalog-context";
import type { Model } from "@/src/types";
import { toast } from "sonner";

interface EditModelDialogProps {
  model: Model | null;
  open: boolean;
  onClose: () => void;
}

export function EditModelDialog({ model, open, onClose }: EditModelDialogProps) {
  const { updateModel } = useCatalog();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (model) {
      setName(model.name);
      setDescription(model.description);
      setFullDescription(model.fullDescription);
      setImage(model.image);
      setCount(String(model.count));
    }
  }, [model]);

  function handleSave() {
    if (!model) return;
    const parsedCount = parseInt(count, 10);
    if (!name.trim()) {
      toast.error("O nome do modelo é obrigatório.");
      return;
    }
    if (isNaN(parsedCount) || parsedCount < 0) {
      toast.error("Quantidade deve ser um número válido.");
      return;
    }
    updateModel(model.id, {
      name: name.trim(),
      description: description.trim(),
      fullDescription: fullDescription.trim(),
      image: image.trim(),
      count: parsedCount,
    });
    toast.success(`Modelo "${name}" atualizado com sucesso.`);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Editar Modelo</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="model-name">Nome</Label>
            <Input id="model-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Tote" />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="model-description">Descrição curta</Label>
            <Input
              id="model-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Espaçosa e versátil"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="model-full-description">Descrição completa</Label>
            <Textarea
              id="model-full-description"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={3}
              placeholder="Texto exibido na página do modelo"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="model-image">Caminho da imagem</Label>
            <Input
              id="model-image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Ex: /images/tote.jpg"
            />
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="preview" className="mt-1 h-24 w-auto rounded-md border object-contain" />
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="model-count">Quantidade em estoque</Label>
            <Input
              id="model-count"
              type="number"
              min={0}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Ex: 12"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
