"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mockSessoesEstudo, mockConfiguracoes } from "@/lib/mocks";
import {
  Coffee,
  Flame,
  RotateCcw,
  Sidebar,
  Timer,
} from "lucide-react";

const weekDays = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
const minutesData = [20, 35, 15, 40, 28, 10, 35];
const cyclesData = [2, 3, 1, 4, 2, 1, 2];

const historyStats = [
  { icon: Timer, label: "Total Tempo em Foco:", value: "200" },
  { icon: RotateCcw, label: "Total de Ciclos:", value: "7" },
];

const todayStats = [
  { icon: Timer, label: "Minutos trabalhados Hoje:", value: "35" },
  { icon: RotateCcw, label: "Ciclos Hoje:", value: "2" },
  { icon: Coffee, label: "Minutos Descansados:", value: "10" },
];

const periods = ["Semana", "Mês", "Ano"] as const;

export default function DadosPage() {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("Semana");
  const [sessoes, setSessoes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sessoes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSessoes(data);
      })
      .catch(console.error);
  }, []);

  let totalFoco = 0;
  let totalCiclos = 0;
  let hojeFoco = 0;
  let hojeCiclos = 0;
  let hojeDescanso = 0;

  const hojeStr = new Date().toDateString();

  // Misturar mocks para visualização na tela de testes
  const mocksComConfig = mockSessoesEstudo.map(mock => ({
    ...mock,
    configuracao: mockConfiguracoes.find(c => c.id === mock.configuracaoId)
  }));
  
  const allSessoes = [...sessoes, ...mocksComConfig];

  allSessoes.forEach(s => {
    const config = s.configuracao;
    if (!config) return;
    
    const foco = config.duracaoFocoMin * s.ciclosCompletos;
    const descanso = config.duracaoPausaCurtaMin * s.ciclosCompletos;
    
    totalFoco += foco;
    totalCiclos += s.ciclosCompletos;
    
    if (new Date(s.inicio).toDateString() === hojeStr) {
      hojeFoco += foco;
      hojeCiclos += s.ciclosCompletos;
      hojeDescanso += descanso;
    }
  });

  const historyStats = [
    { icon: Timer, label: "Total Tempo em Foco (min):", value: totalFoco.toString() },
    { icon: RotateCcw, label: "Total de Ciclos:", value: totalCiclos.toString() },
  ];

  const todayStats = [
    { icon: Timer, label: "Minutos trabalhados Hoje:", value: hojeFoco.toString() },
    { icon: RotateCcw, label: "Ciclos Hoje:", value: hojeCiclos.toString() },
    { icon: Coffee, label: "Minutos Descansados:", value: hojeDescanso.toString() },
  ];

  return (
    <div className="flex min-h-[500px] flex-col">
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <button
          type="button"
          aria-label="Alternar painel lateral"
          className="text-[#04D939] transition-all hover:brightness-110"
        >
          <Sidebar size={24} strokeWidth={2} />
        </button>

        <div className="absolute left-1/2 flex -translate-x-1/2 gap-4">
          <Link
            href="/timer"
            className="rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
          >
            Foco
          </Link>
          <div className="rounded-full bg-[#04D939] px-8 py-2 text-sm font-bold text-[#012340]">
            Dados
          </div>
          <Link
            href="/logs"
            className="rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
          >
            Logs
          </Link>
        </div>

        <div className="w-6" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full border border-[#04D939]/30 bg-[#04D939]/10 shadow-[0_0_24px_rgba(4,217,57,0.2)]">
                  <Flame className="size-8 text-[#04D939]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Ofensiva atual
                  </h2>
                  <p className="text-sm text-[#8fa8c4]">Série atual: 3 Dias</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                Histórico
              </h2>
              <ul className="space-y-4">
                {historyStats.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-4 text-[#04D939]" />
                      <span className="text-sm text-[#8fa8c4]">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
              Hoje em Detalhes
            </h2>
            <ul className="divide-y divide-white/5">
              {todayStats.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="size-4 text-[#04D939]" />
                    <span className="text-sm text-[#8fa8c4]">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">
              Análise de Produtividade
            </h2>
            <div className="flex rounded-full bg-[#112031] p-1">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setActivePeriod(period)}
                  className={
                    activePeriod === period
                      ? "rounded-full bg-[#1a2c42] px-4 py-1.5 text-xs font-semibold text-white"
                      : "rounded-full px-4 py-1.5 text-xs font-semibold text-[#8fa8c4] transition-colors hover:text-white"
                  }
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-[#0a1522]/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                  Minutos
                </p>
                <span className="text-[10px] text-[#8fa8c4]">
                  {activePeriod} atual
                </span>
              </div>
              <div className="flex h-44 items-end justify-between gap-2">
                {minutesData.map((value, index) => (
                  <div
                    key={weekDays[index]}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-lg bg-linear-to-t from-[#04D939]/20 to-[#04D939]"
                      style={{ height: `${(value / 40) * 100}%` }}
                    />
                    <span className="text-[10px] uppercase text-[#8fa8c4]">
                      {weekDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0a1522]/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                  Ciclos
                </p>
                <span className="text-[10px] text-[#8fa8c4]">
                  {activePeriod} atual
                </span>
              </div>
              <div className="flex h-44 items-end justify-between gap-2">
                {cyclesData.map((value, index) => (
                  <div
                    key={weekDays[index]}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-full bg-linear-to-t from-[#04D939]/30 to-[#04D939]"
                      style={{ height: `${(value / 4) * 100}%` }}
                    />
                    <span className="text-[10px] uppercase text-[#8fa8c4]">
                      {weekDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
