"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type DeleteUsuarioButtonProps = {
  usuarioId: string;
  usuarioNome: string;
};

export function DeleteUsuarioButton({
  usuarioId,
  usuarioNome,
}: DeleteUsuarioButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Deseja excluir a conta de ${usuarioNome}? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/usuarios/${usuarioId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível excluir o usuário");
        return;
      }

      router.push("/usuarios");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Excluindo..." : "Excluir conta"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
