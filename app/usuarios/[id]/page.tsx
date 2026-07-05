import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#04D939]">
          Perfil
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {usuario.nome}
        </h1>
        <p className="text-sm text-[#8fa8c4]">
          Conta criada em {formatDate(usuario.criadoEm)}
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-white/5 bg-[#0d1826]/80 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Editar perfil</h2>
        <UsuarioForm
          mode="edit"
          usuarioId={usuario.id}
          defaultValues={{
            nome: usuario.nome,
            email: usuario.email,
          }}
        />
      </section>

      <section className="mb-8 rounded-2xl border border-[#BC2F32]/40 bg-[#BC2F32]/5 p-6">
        <h2 className="mb-2 text-lg font-semibold text-[#ff8a8a]">
          Zona de perigo
        </h2>
        <p className="mb-4 text-sm text-[#8fa8c4]">
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
    </div>
  );
}
