"use client";

import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useCatalog } from "@/src/contexts/catalog-context";
import { addProductAction, updateProductAction, deleteProductAction } from "@/src/actions/catalog/actions";
import type { Product } from "@/src/types";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface ProductFormDialogProps {
  modelId: string;
  modelName: string;
  /** Produto a editar. Null = modo cadastro. */
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductFormDialog({ modelId, modelName, product, open, onClose }: ProductFormDialogProps) {
  const { addProduct, updateProduct, deleteProduct } = useCatalog();

  const isEditing = product !== null;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");

  const { execute: executeAdd, isPending: isAdding } = useAction(addProductAction, {
    onSuccess: ({ data }) => {
      const parsedPrice = parseFloat(price.replace(",", "."));
      const newId = (data as { productId: string } | undefined)?.productId ?? crypto.randomUUID();
      addProduct(modelId, { id: newId, name: name.trim(), price: parsedPrice, color: color.trim() });
      toast.success(`Produto "${name.trim()}" cadastrado em ${modelName}.`);
      onClose();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erro ao salvar produto. Tente novamente.");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateProductAction, {
    onSuccess: () => {
      const parsedPrice = parseFloat(price.replace(",", "."));
      if (product) {
        updateProduct(modelId, product.id, {
          name: name.trim(),
          price: parsedPrice,
          color: color.trim(),
        });
        toast.success(`Produto "${name.trim()}" atualizado.`);
      }
      onClose();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erro ao salvar produto. Tente novamente.");
    },
  });

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteProductAction, {
    onSuccess: () => {
      if (!product) return;
      deleteProduct(modelId, product.id);
      toast.success(`Produto "${product.name}" removido.`);
      onClose();
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Erro ao excluir produto. Tente novamente.");
    },
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setColor(product.color);
    } else {
      setName("");
      setPrice("");
      setColor("");
    }
  }, [product, open]);

  function handleSave() {
    const parsedPrice = parseFloat(price.replace(",", "."));
    if (!name.trim()) {
      toast.error("O nome do produto é obrigatório.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Informe um preço válido.");
      return;
    }
    if (!color.trim()) {
      toast.error("A cor é obrigatória.");
      return;
    }

    if (isEditing && product) {
      executeUpdate({ productId: product.id, name: name.trim(), price: parsedPrice, colorName: color.trim() });
    } else {
      executeAdd({ modelSlug: modelId, name: name.trim(), price: parsedPrice, colorName: color.trim() });
    }
  }

  function handleDelete() {
    if (!product) return;
    executeDelete({ productId: product.id });
  }

  const isPending = isAdding || isUpdating || isDeleting;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditing ? "Editar Produto" : `Novo Produto — ${modelName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="product-name">Nome do produto</Label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tote Caramelo Classic"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="product-price">Preço (R$)</Label>
            <Input
              id="product-price"
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 1890"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="product-color">Cor</Label>
            <Input
              id="product-color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ex: Caramelo"
            />
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          {isEditing ? (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending} className="gap-1.5">
              <Trash2 className="size-4" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
