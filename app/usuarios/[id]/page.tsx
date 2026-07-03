import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DeleteUsuarioButton } from "@/components/usuarios/delete-usuario-button";
import { UsuarioForm } from "@/components/usuarios/usuario-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getUsuarioById } from "@/lib/services/usuario.service";

export const dynamic = "force-dynamic";

type UsuarioPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default async function UsuarioPage({ params }: UsuarioPageProps) {
  const { id } = await params;
  const usuario = await getUsuarioById(id);

  if (!usuario) {
    notFound();
  }

  return (
    <AppShell showNav={false} contentClassName="mx-auto max-w-2xl">
      <div className="mb-8 space-y-1">
        <p className="ds-label text-primary">Perfil</p>
        <h1 className="text-3xl font-bold tracking-tight">{usuario.nome}</h1>
        <p className="text-sm text-muted-foreground">
          Conta criada em {formatDate(usuario.criadoEm)}
        </p>
      </div>

      <section className="ds-card mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar perfil</h2>
        <UsuarioForm
          mode="edit"
          usuarioId={usuario.id}
          defaultValues={{
            nome: usuario.nome,
            email: usuario.email,
          }}
        />
      </section>

      <section className="mb-8 rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <h2 className="mb-2 text-lg font-semibold text-destructive">
          Zona de perigo
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Excluir permanentemente esta conta e todos os dados associados.
        </p>
        <DeleteUsuarioButton
          usuarioId={usuario.id}
          usuarioNome={usuario.nome}
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/usuarios"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Ver todos os usuários
        </Link>
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
