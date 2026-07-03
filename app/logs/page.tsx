<<<<<<< HEAD
import { AppShell } from "@/components/layout/app-shell";

const logs = [
  {
    cycles: 3,
    started: "09:30",
    finished: "11:04",
    active: "48 min",
    rest: "17 min",
    day: "03",
    month: "MAIO",
    year: "2026",
  },
  {
    cycles: 17,
    started: "14:10",
    finished: "18:45",
    active: "3h 12min",
    rest: "45 min",
    day: "02",
    month: "MAIO",
    year: "2026",
  },
  {
    cycles: 8,
    started: "08:00",
    finished: "10:20",
    active: "1h 52min",
    rest: "28 min",
    day: "01",
    month: "MAIO",
    year: "2026",
  },
];

export default function Logs() {
  return (
    <AppShell activeTab="logs">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {logs.map((log) => (
          <article
            key={`${log.day}-${log.started}`}
            className="ds-card grid gap-6 p-5 md:grid-cols-[120px_1fr_100px] md:items-center"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="ds-label">Ciclos concluídos</p>
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-primary text-3xl font-bold text-foreground">
                {log.cycles}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="ds-label">Começou:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.started}
                  </p>
                </div>
                <div>
                  <p className="ds-label">Terminou:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.finished}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="ds-label">Tempo ativo:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.active}
                  </p>
                </div>
                <div>
                  <p className="ds-label">Tempo descanso:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.rest}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold leading-none text-foreground">
                  {log.day}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                  {log.month}
                </p>
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                  {log.year}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
=======
"use client";

import { useEffect, useState } from "react";
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



>>>>>>> 11bfee9ce0c3972a795615aa77e6e82e31bb7a7a
