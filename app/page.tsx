import Link from "next/link";
import { Play, ScrollText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-white tracking-widest mb-2">work & rest</h1>
      <h2 className="text-[#04D939] text-lg font-medium mb-12">Seja bem-vindo!</h2>
      
      <div className="flex flex-col gap-5 w-full">
        
        {/* Botão Primário (Preenchido) Clean */}
        <Link 
          href="/cadastro" 
          className="w-full rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center bg-[#04D939] text-[#012340] hover:brightness-110"
        >
          CRIAR MINHA CONTA
        </Link>
        
        {/* Botão Secundário (Outline) estilo botão Play */}
        <Link 
          href="/timer"
          className="w-full border border-[#04D939] text-[#04D939] bg-[#04D939]/5 hover:bg-[#04D939] hover:text-[#012340] rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Play size={18} fill="currentColor" />
          COMEÇAR SEM CONTA
        </Link>

        {/* Botão Terciário (Outline) para Logs */}
        <Link 
          href="/logs"
          className="w-full border border-slate-500 text-slate-400 bg-slate-500/5 hover:bg-slate-400 hover:text-[#012340] rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 mt-2"
        >
          <ScrollText size={18} />
          VER HISTÓRICO (LOGS)
        </Link>
      </div>
    </div>
  );
}
