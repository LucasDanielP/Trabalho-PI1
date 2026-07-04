"use client";

import { mockSessoesEstudo, mockConfiguracoes } from "@/lib/mocks";
import Link from "next/link";
import { Sidebar } from "lucide-react";

export default function LogsPage() {
  // Formatadores de data e hora
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatMonth = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();
  const formatDay = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit' });
  const formatYear = (date: Date) => date.toLocaleDateString('pt-BR', { year: 'numeric' });

  return (
    <div className="flex flex-col h-full w-full text-white font-sans">
      
      {/* Barra Superior (Idêntica à tela de Foco) */}
      <div className="relative z-10 flex items-center justify-between mb-16">
        
        {/* Mantendo um placeholder ou ícone escondido para alinhar perfeitamente ao centro */}
        <div className="w-6 invisible">
          <Sidebar size={24} strokeWidth={2} />
        </div>

        {/* Abas Centrais */}
        <div className="flex gap-4 absolute left-1/2 -translate-x-1/2">
          <Link 
            href="/timer" 
            className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white"
          >
            Foco
          </Link>
          <Link 
            href="/dados" 
            className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white"
          >
            Dados
          </Link>
          <div className="px-8 py-2 rounded-full text-sm font-bold bg-[#04D939] text-[#012340]">
            Logs
          </div>
        </div>

        {/* Placeholder vazio para alinhar corretamente com space-between */}
        <div className="w-6"></div>
      </div>

      <div className="w-full max-w-[950px] mx-auto flex flex-col gap-8 pb-10">
        {mockSessoesEstudo.map((sessao) => {
          const config = mockConfiguracoes.find((c) => c.id === sessao.configuracaoId);
          
          // Tempo ativo e descanso simulados para o visual
          const tempoAtivo = config ? config.duracaoFocoMin * sessao.ciclosCompletos : 0;
          const tempoDescanso = config ? config.duracaoPausaCurtaMin * sessao.ciclosCompletos : 0;

          return (
            <div 
              key={sessao.id} 
              className="flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#04D939]/60 bg-transparent rounded-[1.25rem] p-6 lg:p-8 shadow-lg w-full"
            >
              {/* Ciclos Concluídos (Esquerda) */}
              <div className="flex flex-col items-center lg:items-start shrink-0">
                <span className="text-[14px] font-bold text-white mb-3">Ciclos concluídos</span>
                <div className="w-[110px] h-[110px] rounded-full border-[4px] border-[#04D939] flex items-center justify-center bg-[#012340]">
                  <span className="text-[3rem] font-bold text-white leading-none">{sessao.ciclosCompletos}</span>
                </div>
              </div>

              {/* Grid Central de Informações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full lg:min-w-[450px]">
                {/* Começou */}
                <div className="border border-[#04D939]/40 rounded-xl px-5 py-4 bg-[#04D939]/5 flex flex-col justify-center">
                  <span className="text-[13px] sm:text-[14px] text-white font-medium mb-1">Começou:</span>
                  <span className="text-2xl sm:text-[28px] font-medium leading-tight" suppressHydrationWarning>{formatTime(sessao.inicio)}</span>
                </div>
                {/* Tempo Ativo */}
                <div className="border border-[#04D939]/40 rounded-xl px-5 py-4 bg-[#04D939]/5 flex flex-col justify-center">
                  <span className="text-[13px] sm:text-[14px] text-white font-medium mb-1">Tempo ativo:</span>
                  <span className="text-2xl sm:text-[28px] font-medium leading-tight whitespace-nowrap">{tempoAtivo} min</span>
                </div>
                {/* Terminou */}
                <div className="border border-[#04D939]/40 rounded-xl px-5 py-4 bg-[#04D939]/5 flex flex-col justify-center">
                  <span className="text-[13px] sm:text-[14px] text-white font-medium mb-1">Terminou:</span>
                  <span className="text-2xl sm:text-[28px] font-medium leading-tight" suppressHydrationWarning>
                    {sessao.fim ? formatTime(sessao.fim) : "--:--"}
                  </span>
                </div>
                {/* Tempo Descanso */}
                <div className="border border-[#04D939]/40 rounded-xl px-5 py-4 bg-[#04D939]/5 flex flex-col justify-center">
                  <span className="text-[13px] sm:text-[14px] text-white font-medium mb-1">Tempo descanso:</span>
                  <span className="text-2xl sm:text-[28px] font-medium leading-tight whitespace-nowrap">{tempoDescanso} min</span>
                </div>
              </div>

              {/* Data (Direita) */}
              <div className="flex flex-col items-center justify-center shrink-0 min-w-[120px]">
                <span className="text-[52px] font-bold leading-none mb-2 tracking-tight" suppressHydrationWarning>{formatDay(sessao.inicio)}</span>
                <span className="text-[18px] font-normal tracking-[0.05em] leading-tight text-white mb-1" suppressHydrationWarning>{formatMonth(sessao.inicio)}</span>
                <span className="text-[18px] font-normal tracking-[0.05em] leading-tight text-white" suppressHydrationWarning>{formatYear(sessao.inicio)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
