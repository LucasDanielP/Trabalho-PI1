import Link from "next/link";

import { UsuarioForm } from "@/components/usuarios/usuario-form";

export default function Cadastro() {
  return (
    <>
      <div className="relative z-10 mb-10 flex justify-center gap-4">
        <Link
          href="/login"
          className="rounded-full bg-[#1a2c42] px-6 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          Login
        </Link>
        <div
          className="rounded-full px-6 py-2 text-sm font-bold shadow-lg"
          style={{ backgroundColor: "#04D939", color: "#012340" }}
        >
          Cadastro
        </div>
      </div>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-wider text-white">
          CRIAR CONTA
        </h2>
        <p className="mt-2 text-sm font-medium text-[#04D939]">
          Junte-se ao work &amp; rest
        </p>
      </div>

      <UsuarioForm mode="create" variant="cadastro" redirectTo="/timer" />
    </>
  );
}
