"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Coffee,
  Flame,
  RotateCcw,
  Timer,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import { FocoLayout } from "@/components/layout/foco-nav";
import { calcularOfensiva, calcularTempos } from "@/lib/sessao/calculos";
import { getGuestSessoes } from "@/lib/sessao/guest-storage";
import type { ResumoDados } from "@/interfaces/Sessao";
import type { SessaoEstudo } from "@/interfaces/Sessao";

const periods = ["Semana", "Mês", "Ano"] as const;
const weekDays = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

function buildGuestResumo(
  sessoes: SessaoEstudo[],
  periodo: (typeof periods)[number],
): ResumoDados {
  const finalizadas = sessoes.filter((s) => s.ciclosCompletos > 0);
  const agora = new Date();
  const inicio = new Date(agora);
  if (periodo === "Semana") inicio.setDate(agora.getDate() - 6);
  else if (periodo === "Mês") inicio.setDate(agora.getDate() - 29);
  else inicio.setFullYear(agora.getFullYear() - 1);
  inicio.setHours(0, 0, 0, 0);

  let totalMinutosFoco = 0;
  let totalCiclos = 0;
  let hojeMinutosFoco = 0;
  let hojeCiclos = 0;
  let hojeMinutosDescanso = 0;
  const hojeStr = agora.toDateString();
  const porDia = new Map<string, { ciclos: number; minutos: number }>();

  for (const s of finalizadas) {
    const config = s.configuracao;
    const { ativo, descanso } = calcularTempos(s, config);
    totalMinutosFoco += ativo;
    totalCiclos += s.ciclosCompletos;
    const dia = new Date(s.inicio).toDateString();
    const atual = porDia.get(dia) ?? { ciclos: 0, minutos: 0 };
    atual.ciclos += s.ciclosCompletos;
    atual.minutos += ativo;
    porDia.set(dia, atual);
    if (dia === hojeStr) {
      hojeMinutosFoco += ativo;
      hojeCiclos += s.ciclosCompletos;
      hojeMinutosDescanso += descanso;
    }
  }

  const pontos = [...porDia.entries()]
    .filter(([d]) => new Date(d) >= inicio)
    .map(([d, v]) => ({
      data: new Date(d).toISOString(),
      ciclos: v.ciclos,
      minutosEstudados: v.minutos,
    }));

  return {
    ofensivaDias: calcularOfensiva(finalizadas.map((s) => s.inicio)),
    totalMinutosFoco,
    totalCiclos,
    hojeMinutosFoco,
    hojeCiclos,
    hojeMinutosDescanso,
    graficoMinutos: pontos,
    graficoCiclos: pontos,
  };
}

function DadosContent() {
  const [activePeriod, setActivePeriod] =
    useState<(typeof periods)[number]>("Semana");
  const [resumo, setResumo] = useState<ResumoDados | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();

      if (me.usuario) {
        const res = await fetch(`/api/dados?periodo=${activePeriod}`);
        setResumo(await res.json());
      } else {
        setIsGuest(true);
      }
    }
    load();
  }, [activePeriod]);

  const chartData = useMemo(() => {
    if (!resumo) return [];
    
    let baseData = resumo.graficoMinutos.map((p, i) => ({
      data: p.data,
      minutosEstudados: p.minutosEstudados,
      ciclos: resumo.graficoCiclos[i]?.ciclos || 0
    }));

    if (activePeriod === "Ano") {
      const map = new Map<string, { data: string, minutosEstudados: number, ciclos: number }>();
      baseData.forEach(p => {
        const d = new Date(p.data);
        const month = d.getMonth();
        const year = d.getFullYear();
        const key = `${year}-${month}`;
        
        const existing = map.get(key) || { data: new Date(year, month, 1).toISOString(), minutosEstudados: 0, ciclos: 0 };
        existing.minutosEstudados += p.minutosEstudados;
        existing.ciclos += p.ciclos;
        map.set(key, existing);
      });
      return Array.from(map.values()).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    }

    return baseData;
  }, [resumo, activePeriod]);

  if (isGuest) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-lg font-semibold text-white">Estatísticas Exclusivas</p>
        <p className="mt-2 text-sm text-[#8fa8c4]">
          Crie uma conta para acompanhar sua evolução, ver seus gráficos de produtividade e sua ofensiva diária.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-[#04D939]/10 px-6 py-2.5 text-sm font-semibold text-[#04D939] hover:bg-[#04D939]/20"
          >
            Fazer Login
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-[#112031] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a2c42]"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    );
  }

  if (!resumo) {
    return <div className="h-96 animate-pulse rounded-2xl bg-[#112031]" />;
  }

  const maxMin = Math.max(...chartData.map((p) => p.minutosEstudados), 1);
  const maxCic = Math.max(...chartData.map((p) => p.ciclos), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0d1826] p-5 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#04D939]/0 via-[#04D939]/5 to-[#04D939]/0 opacity-0 transition-opacity hover:opacity-100 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border border-[#04D939]/30 bg-[#04D939]/10 shadow-[0_0_24px_rgba(4,217,57,0.2)]">
                <Flame className="size-8 text-[#04D939]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Ofensiva atual</h2>
                <p className="mt-1 text-sm font-medium text-[#8fa8c4]">
                  Série atual: <span className="text-[#04D939] font-bold">{resumo.ofensivaDias}</span> {resumo.ofensivaDias === 1 ? "Dia" : "Dias"}
                </p>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0d1826] p-5 shadow-lg">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#8fa8c4]">
              Histórico
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Timer className="size-4 text-[#04D939]" />
                  <span className="text-sm font-medium text-[#8fa8c4]">Tempo em Foco:</span>
                </div>
                <span className="text-base font-bold text-white whitespace-nowrap">
                  {resumo.totalMinutosFoco} min
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="size-4 text-[#04D939]" />
                  <span className="text-sm font-medium text-[#8fa8c4]">Ciclos Concluídos:</span>
                </div>
                <span className="text-base font-bold text-white">
                  {resumo.totalCiclos}
                </span>
              </li>
            </ul>
          </section>
        </div>

        <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0d1826] p-5 shadow-lg">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#8fa8c4]">
              Hoje em Detalhes
            </h2>
            <ul className="divide-y divide-white/5">
              <li className="flex items-center justify-between py-4 gap-2">
                <div className="flex items-center gap-3">
                  <Timer className="size-4 text-[#04D939] shrink-0" />
                  <span className="text-sm font-medium text-[#8fa8c4] leading-tight">Foco Hoje:</span>
                </div>
                <span className="text-base font-bold text-white whitespace-nowrap">{resumo.hojeMinutosFoco} min</span>
              </li>
              <li className="flex items-center justify-between py-4 gap-2">
                <div className="flex items-center gap-3">
                  <RotateCcw className="size-4 text-[#04D939] shrink-0" />
                  <span className="text-sm font-medium text-[#8fa8c4] leading-tight">Ciclos Hoje:</span>
                </div>
                <span className="text-base font-bold text-white whitespace-nowrap">{resumo.hojeCiclos}</span>
              </li>
              <li className="flex items-center justify-between pt-4 gap-2">
                <div className="flex items-center gap-3">
                  <Coffee className="size-4 text-[#04D939] shrink-0" />
                  <span className="text-sm font-medium text-[#8fa8c4] leading-tight">Descanso:</span>
                </div>
                <span className="text-base font-bold text-white whitespace-nowrap">
                  {resumo.hojeMinutosDescanso} min
                </span>
              </li>
            </ul>
          </section>
      </div>

      <section className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0d1826] p-5 shadow-lg mt-2">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Análise de Produtividade</h2>
          <div className="flex rounded-full bg-[#112031] p-1">
            {periods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={
                  activePeriod === period
                    ? "rounded-full bg-[#1a2c42] px-4 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full px-4 py-1.5 text-xs font-semibold text-[#8fa8c4] hover:text-white"
                }
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-[#0a1522]/80 p-4">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
              Minutos
            </p>
            <div className="h-44 w-full mt-4">
              {chartData.length === 0 ? (
                <p className="flex h-full items-center justify-center text-xs text-[#8fa8c4]">Sem dados ainda</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMinutos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#04D939" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#04D939" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="data" 
                      tickFormatter={(data) => {
                        const d = new Date(data);
                        if (activePeriod === "Semana") return weekDays[d.getDay()];
                        if (activePeriod === "Mês") return d.getDate().toString().padStart(2, '0');
                        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                        return months[d.getMonth()];
                      }}
                      stroke="#8fa8c4"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      minTickGap={activePeriod === "Mês" ? 15 : 5}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-white/10 bg-[#112031] p-3 shadow-xl">
                              <p className="text-xs font-semibold text-[#8fa8c4] mb-1 uppercase tracking-wider">
                                {activePeriod === "Ano" 
                                  ? new Date(payload[0].payload.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) 
                                  : new Date(payload[0].payload.data).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-sm font-bold text-white"><span className="text-[#04D939] text-base">{payload[0].value}</span> min em foco</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: '#04D939', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent' }}
                    />
                    <Area type="monotone" dataKey="minutosEstudados" stroke="#04D939" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutos)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a1522]/80 p-4">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
              Ciclos
            </p>
            <div className="h-44 w-full mt-4">
              {chartData.length === 0 ? (
                <p className="flex h-full items-center justify-center text-xs text-[#8fa8c4]">Sem dados ainda</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} barSize={32}>
                    <XAxis 
                      dataKey="data" 
                      tickFormatter={(data) => {
                        const d = new Date(data);
                        if (activePeriod === "Semana") return weekDays[d.getDay()];
                        if (activePeriod === "Mês") return d.getDate().toString().padStart(2, '0');
                        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
                        return months[d.getMonth()];
                      }}
                      stroke="#8fa8c4"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      minTickGap={activePeriod === "Mês" ? 15 : 5}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-white/10 bg-[#112031] p-3 shadow-xl">
                              <p className="text-xs font-semibold text-[#8fa8c4] mb-1 uppercase tracking-wider">
                                {activePeriod === "Ano" 
                                  ? new Date(payload[0].payload.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) 
                                  : new Date(payload[0].payload.data).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-sm font-bold text-white"><span className="text-[#04D939] text-base">{payload[0].value}</span> ciclos completos</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ fill: '#04D939', opacity: 0.1 }}
                    />
                    <Bar dataKey="ciclos" fill="#04D939" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="h-8" />
    </div>
  );
}

export default function DadosPage() {
  return (
    <FocoLayout activeTab="dados">
      <DadosContent />
    </FocoLayout>
  );
}
