import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { UsuarioForm } from "@/components/usuarios/usuario-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignPage() {
  return (
    <AppShell showNav={false} contentClassName="mx-auto max-w-md">
      <div className="mb-8 space-y-2 text-center">
        <p className="ds-label text-primary">Cadastro</p>
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre-se para salvar suas sessões de estudo e acompanhar seu
          progresso.
        </p>
      </div>

      <div className="ds-card p-6">
        <UsuarioForm mode="create" redirectTo="/dados" />
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Voltar para o início
        </Link>
      </div>
    </AppShell>
  );
}
