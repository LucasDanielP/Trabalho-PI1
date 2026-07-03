"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UsuarioFormProps = {
  mode: "create" | "edit";
  variant?: "default" | "cadastro";
  usuarioId?: string;
  defaultValues?: {
    nome: string;
    email: string;
  };
  redirectTo?: string;
};

const cadastroInputClassName =
  "h-auto rounded-full border-[#1a2c42] bg-[#0d1826] py-3.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus-visible:border-[#04D939] focus-visible:ring-[#04D939]/20";

export function UsuarioForm({
  mode,
  variant = "default",
  usuarioId,
  defaultValues,
  redirectTo,
}: UsuarioFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(defaultValues?.nome ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCadastro = variant === "cadastro";

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
      <div className={cn("flex flex-col", isCadastro ? "gap-1.5" : "gap-2")}>
        {!isCadastro ? <Label htmlFor="nome">Nome</Label> : null}
        <div className="relative">
          {isCadastro ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <User size={18} />
            </div>
          ) : null}
          <Input
            id="nome"
            name="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder={isCadastro ? "Nome completo" : "Seu nome"}
            className={isCadastro ? cadastroInputClassName : undefined}
            required
            minLength={2}
            maxLength={100}
          />
        </div>
      </div>

      <div className={cn("flex flex-col", isCadastro ? "gap-1.5" : "gap-2")}>
        {!isCadastro ? <Label htmlFor="email">E-mail</Label> : null}
        <div className="relative">
          {isCadastro ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail size={18} />
            </div>
          ) : null}
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={isCadastro ? "E-mail" : "seu@email.com"}
            className={isCadastro ? cadastroInputClassName : undefined}
            required
          />
        </div>
      </div>

      {error ? (
        <p
          className={cn(
            "text-sm",
            isCadastro
              ? "rounded-full border border-[#BC2F32]/40 bg-[#BC2F32]/10 px-4 py-2 text-[#ff8a8a]"
              : "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive",
          )}
        >
          {error}
        </p>
      ) : null}

      {isCadastro ? (
        <div className="mt-4 border-t border-white/5 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-full bg-[#04D939] py-4 font-bold tracking-wide text-[#012340] transition-all duration-300 hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting ? "SALVANDO..." : "CADASTRAR"}
          </button>
        </div>
      ) : (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : mode === "create"
              ? "Criar conta"
              : "Salvar alterações"}
        </Button>
      )}
    </form>
  );
}
