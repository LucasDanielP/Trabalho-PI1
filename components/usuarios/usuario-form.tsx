"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UsuarioFormProps = {
  mode: "create" | "edit";
  usuarioId?: string;
  defaultValues?: {
    nome: string;
    email: string;
  };
  redirectTo?: string;
};

export function UsuarioForm({
  mode,
  usuarioId,
  defaultValues,
  redirectTo,
}: UsuarioFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(defaultValues?.nome ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/usuarios" : `/api/usuarios/${usuarioId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível salvar o usuário");
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      router.push(`/usuarios/${data.id}`);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          name="nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          placeholder="Seu nome"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Salvando..."
          : mode === "create"
            ? "Criar conta"
            : "Salvar alterações"}
      </Button>
    </form>
  );
}
