import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listUsuarios } from "@/lib/services/usuario.service";

export const dynamic = "force-dynamic";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default async function UsuariosPage() {
  const usuarios = await listUsuarios();

  return (
    <AppShell showNav={false} contentClassName="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="ds-label text-primary">Contas</p>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as contas cadastradas no sistema.
          </p>
        </div>

        <Link href="/cadastro" className={cn(buttonVariants())}>
          Novo usuário
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <div className="ds-card border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum usuário cadastrado ainda.
          </p>
          <Link
            href="/cadastro"
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Criar primeira conta
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {usuarios.map((usuario) => (
            <li
              key={usuario.id}
              className="ds-card flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-semibold text-foreground">{usuario.nome}</p>
                <p className="text-sm text-muted-foreground">{usuario.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Criado em {formatDate(usuario.criadoEm)}
                </p>
              </div>

              <Link
                href={`/usuarios/${usuario.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
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
