import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

export default function Cadastro() {
  return (
    <>
      {/* Abas Superiores (Estilo "Foco | Dados | Logs") */}
      <div className="relative z-10 flex justify-center mb-10 gap-4">
        <Link 
          href="/login" 
          className="px-6 py-2 rounded-full text-sm font-semibold transition-colors bg-[#1a2c42] text-gray-400 hover:text-white"
        >
          Login
        </Link>
        <div className="px-6 py-2 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: '#04D939', color: '#012340' }}>
          Cadastro
        </div>
      </div>

      {/* Título Centralizado (Estilo do cronômetro) */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white tracking-wider">
          CRIAR CONTA
        </h2>
        <p className="text-[#04D939] text-sm mt-2 font-medium">Junte-se ao work & rest</p>
      </div>

      {/* Formulário */}
      <form className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-1.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Nome completo"
              className="w-full bg-[#0d1826] border border-[#1a2c42] rounded-full py-3.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#04D939] transition-colors"
              required
            />
          </div>
        </div>

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
        </div>

        {/* Botões Inferiores (Estilo dos botões de Pause / Reset) */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <button 
            type="submit"
            className="w-full rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center bg-[#04D939] text-[#012340] hover:brightness-110"
          >
            CADASTRAR
          </button>
        </div>
      </form>
    </>
  );
}
