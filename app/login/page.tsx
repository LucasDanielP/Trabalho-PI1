import Link from "next/link";

import { LoginForm } from "@/components/usuarios/login-form";

export default function Login() {
  return (
    <>
      <div className="relative z-10 mb-10 flex justify-center gap-4">
        <div
          className="rounded-full px-6 py-2 text-sm font-bold shadow-lg"
          style={{ backgroundColor: "#04D939", color: "#012340" }}
        >
          Login
        </div>
        <Link
          href="/cadastro"
          className="rounded-full bg-[#1a2c42] px-6 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          Cadastro
        </Link>
      </div>

      <div className="relative z-10 mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-wider text-white">
          BEM-VINDO
        </h2>
        <p className="mt-2 text-sm font-medium text-[#04D939]">
          Acesse sua conta
        </p>
      </div>

      <LoginForm />
    </>
  );
}
