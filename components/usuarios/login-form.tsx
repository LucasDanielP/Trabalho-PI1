"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

const inputClassName =
  "h-auto w-full rounded-full border border-[#1a2c42] bg-[#0d1826] py-3.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus-visible:border-[#04D939] focus-visible:outline-none focus-visible:ring-[#04D939]/20";

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo = "/timer" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "E-mail ou senha inválidos");
        return;
      }

      window.location.href = redirectTo;
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Mail size={18} />
          </div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="E-mail"
            className={inputClassName}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Lock size={18} />
          </div>
          <input
            type="password"
            name="senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Senha"
            className={inputClassName}
            required
          />
        </div>
        <div className="mt-1 flex justify-end">
          <Link
            href="#"
            className="text-xs text-gray-400 transition-colors hover:text-[#04D939]"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      {error ? (
        <p
          className={cn(
            "rounded-full border border-[#BC2F32]/40 bg-[#BC2F32]/10 px-4 py-2 text-sm text-[#ff8a8a]",
          )}
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 border-t border-white/5 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-full bg-[#04D939] py-4 font-bold tracking-wide text-[#012340] transition-all duration-300 hover:brightness-110 disabled:opacity-50"
        >
          {isSubmitting ? "ENTRANDO..." : "ENTRAR"}
        </button>
      </div>
    </form>
  );
}
