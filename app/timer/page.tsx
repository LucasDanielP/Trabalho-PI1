import Link from "next/link";
import { Sidebar, RotateCcw, Pause, StepForward } from "lucide-react";

export default function Timer() {
  return (
    <div className="flex flex-col h-full justify-between">
      
      {/* Barra Superior */}
      <div className="relative z-10 flex items-center justify-between mb-16">
        
        {/* Ícone Sidebar (Canto Superior Esquerdo) */}
        <button className="text-[#04D939] hover:brightness-110 transition-all">
          <Sidebar size={24} strokeWidth={2} />
        </button>

        {/* Abas Centrais */}
        <div className="flex gap-4 absolute left-1/2 -translate-x-1/2">
          <div className="px-8 py-2 rounded-full text-sm font-bold bg-[#04D939] text-[#012340]">
            Foco
          </div>
          <Link 
            href="#" 
            className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white"
          >
            Dados
          </Link>
          <Link 
            href="#" 
            className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white"
          >
            Logs
          </Link>
        </div>

        {/* Placeholder vazio para alinhar corretamente com space-between */}
        <div className="w-6"></div>
      </div>

      {/* Relógio Circular (Timer) */}
      <div className="relative flex items-center justify-center mb-16 mt-4">
        {/* SVG Circular Progress Bar com drop-shadow (x=0, y=4, blur=4) */}
        <svg 
          className="w-72 h-72 transform -rotate-90"
          style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4))' }}
        >
          <defs>
            {/* Sombra Interna Figma (x=0, y=5, blur=4 -> stdDeviation=2) */}
            <filter id="inner-shadow">
              <feOffset dx="0" dy="5"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.6" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          {/* Fundo do círculo (trilha verde escura) */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="#0a3f24" /* Tom de verde bem escuro da imagem */
            strokeWidth="16"
            fill="transparent"
          />
          {/* Progresso (verde neon) com sombra interna */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="#04D939"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray="753.98"
            strokeDashoffset="600" /* Parcialmente preenchido para ilustrar */
            filter="url(#inner-shadow)"
          />
        </svg>

        {/* Textos dentro do Timer */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-white text-5xl font-semibold tracking-wide tabular-nums">
            22:47
          </span>
        </div>
      </div>

      {/* Controles do Timer */}
      <div className="flex justify-center items-center gap-6 w-full mb-4">
        
        {/* Botão Reset */}
        <button className="w-32 border border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:bg-[#04D939]/25 active:bg-[#04D939]/40 rounded-full py-2.5 font-medium transition-all flex items-center justify-center cursor-pointer">
          <RotateCcw size={20} strokeWidth={2} />
        </button>
        
        {/* Botão Pausar */}
        <button className="w-40 border border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:border-[#BC2F32] hover:text-[#BC2F32] hover:bg-[#BC2F32]/15 active:bg-[#BC2F32]/30 rounded-full py-2.5 font-medium transition-all flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer">
          <Pause size={18} fill="currentColor" strokeWidth={0} />
          PAUSAR
        </button>

        {/* Botão Next */}
        <button className="w-32 border border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:bg-[#04D939]/25 active:bg-[#04D939]/40 rounded-full py-2.5 font-medium transition-all flex items-center justify-center cursor-pointer">
          <StepForward size={20} strokeWidth={2} />
        </button>
        
      </div>

    </div>
  );
}
