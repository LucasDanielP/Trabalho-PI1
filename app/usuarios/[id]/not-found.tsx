import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UsuarioNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-white">Usuário não encontrado</h1>
      <p className="text-sm text-[#8fa8c4]">
        A conta que você procura não existe ou foi removida.
      </p>
      <Link href="/usuarios" className={cn(buttonVariants())}>
        Ver usuários
      </Link>
    </div>
  );
}
