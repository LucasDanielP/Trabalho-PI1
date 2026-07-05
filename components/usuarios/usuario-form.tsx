"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";

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
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCadastro = variant === "cadastro";
  const isCreate = mode === "create";

  async function autenticarAposCadastro(emailValue: string, senhaValue: string) {
    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue, senha: senhaValue }),
    });

    if (!loginResponse.ok) {
      const loginData = await loginResponse.json();
      throw new Error(loginData.error ?? "Conta criada, mas não foi possível entrar");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const body = isCreate
        ? { nome, email, senha }
        : { nome, email };

      const response = await fetch(
        isCreate ? "/api/usuarios" : `/api/usuarios/${usuarioId}`,
        {
          method: isCreate ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível salvar o usuário");
        return;
      }

      if (isCreate && isCadastro) {
        await autenticarAposCadastro(email, senha);
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      router.push(`/usuarios/${data.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Erro de conexão. Tente novamente.",
      );
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

      {isCreate ? (
        <div className={cn("flex flex-col", isCadastro ? "gap-1.5" : "gap-2")}>
          {!isCadastro ? <Label htmlFor="senha">Senha</Label> : null}
          <div className="relative">
            {isCadastro ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </div>
            ) : null}
            <Input
              id="senha"
              name="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder={isCadastro ? "Senha" : "Mínimo 6 caracteres"}
              className={isCadastro ? cadastroInputClassName : undefined}
              required
              minLength={6}
              maxLength={72}
            />
          </div>
        </div>
      ) : null}

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
            : isCreate
              ? "Criar conta"
              : "Salvar alterações"}
        </Button>
      )}
    </form>
  );
}
