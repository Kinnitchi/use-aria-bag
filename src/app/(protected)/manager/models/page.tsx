"use client";

import { useState } from "react";
import { PageHeader } from "../_components/page-header";
import { ModelsTable } from "../_components/models-table";
import { EditModelDialog } from "../_components/edit-model-dialog";
import type { Model } from "@/src/types";

export default function ModelosPage() {
  const [editModelTarget, setEditModelTarget] = useState<Model | null>(null);

  return (
    <>
      <PageHeader title="Gerenciar Modelos" />
      <div className="p-6">
        <ModelsTable onEditModel={setEditModelTarget} />
      </div>

      <EditModelDialog
        model={editModelTarget}
        open={editModelTarget !== null}
        onClose={() => setEditModelTarget(null)}
      />
    </>
  );
}
