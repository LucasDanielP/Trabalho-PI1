import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <>
      {/* Abas Superiores (Estilo "Foco | Dados | Logs") */}
      <div className="relative z-10 flex justify-center mb-10 gap-4">
        <div className="px-6 py-2 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: '#04D939', color: '#012340' }}>
          Login
        </div>
        <Link 
          href="/cadastro" 
          className="px-6 py-2 rounded-full text-sm font-semibold transition-colors bg-[#1a2c42] text-gray-400 hover:text-white"
        >
          Cadastro
        </Link>
      </div>

      {/* Título Centralizado */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-wider">
          BEM-VINDO
        </h2>
        <p className="text-[#04D939] text-sm mt-2 font-medium">Acesse sua conta</p>
      </div>

      {/* Formulário */}
      <form className="flex flex-col gap-5 relative z-10">
        
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="E-mail"
              className="w-full bg-[#0d1826] border border-[#1a2c42] rounded-full py-3.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#04D939] transition-colors"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Senha"
              className="w-full bg-[#0d1826] border border-[#1a2c42] rounded-full py-3.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#04D939] transition-colors"
              required
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link href="#" className="text-xs text-gray-400 hover:text-[#04D939] transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {/* Botões Inferiores */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <button 
            type="submit"
            className="w-full rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center bg-[#04D939] text-[#012340] hover:brightness-110"
          >
            ENTRAR
          </button>
        </div>
      </form>
    </>
  );
}
