"use client";

import { useEffect, useState } from "react";
import {
  Coffee,
  Flame,
  RotateCcw,
  Timer,
} from "lucide-react";

import { FocoLayout } from "@/components/layout/foco-nav";
import { FocoPagesProvider } from "@/components/foco/foco-pages-provider";
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
    if (!config) continue;
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

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();

      if (me.usuario) {
        const res = await fetch(`/api/dados?periodo=${activePeriod}`);
        setResumo(await res.json());
      } else {
        setResumo(buildGuestResumo(getGuestSessoes(), activePeriod));
      }
    }
    load();
  }, [activePeriod]);

  if (!resumo) {
    return <div className="h-96 animate-pulse rounded-2xl bg-[#112031]" />;
  }

  const maxMin = Math.max(...resumo.graficoMinutos.map((p) => p.minutosEstudados), 1);
  const maxCic = Math.max(...resumo.graficoCiclos.map((p) => p.ciclos), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full border border-[#04D939]/30 bg-[#04D939]/10 shadow-[0_0_24px_rgba(4,217,57,0.2)]">
                <Flame className="size-8 text-[#04D939]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Ofensiva atual</h2>
                <p className="text-sm text-[#8fa8c4]">
                  Série atual: {resumo.ofensivaDias} {resumo.ofensivaDias === 1 ? "Dia" : "Dias"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
              Histórico
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Timer className="size-4 text-[#04D939]" />
                  <span className="text-sm text-[#8fa8c4]">Total Tempo em Foco:</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {resumo.totalMinutosFoco}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCcw className="size-4 text-[#04D939]" />
                  <span className="text-sm text-[#8fa8c4]">Total de Ciclos:</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {resumo.totalCiclos}
                </span>
              </li>
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
            Hoje em Detalhes
          </h2>
          <ul className="divide-y divide-white/5">
            <li className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Timer className="size-4 text-[#04D939]" />
                <span className="text-sm text-[#8fa8c4]">Minutos trabalhados Hoje:</span>
              </div>
              <span className="text-sm font-semibold text-white">{resumo.hojeMinutosFoco}</span>
            </li>
            <li className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="size-4 text-[#04D939]" />
                <span className="text-sm text-[#8fa8c4]">Ciclos Hoje:</span>
              </div>
              <span className="text-sm font-semibold text-white">{resumo.hojeCiclos}</span>
            </li>
            <li className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Coffee className="size-4 text-[#04D939]" />
                <span className="text-sm text-[#8fa8c4]">Minutos Descansados:</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {resumo.hojeMinutosDescanso}
              </span>
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5">
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
            <div className="flex h-44 items-end justify-between gap-2">
              {resumo.graficoMinutos.length === 0 ? (
                <p className="w-full text-center text-xs text-[#8fa8c4]">Sem dados ainda</p>
              ) : (
                resumo.graficoMinutos.map((p) => {
                  const d = new Date(p.data);
                  return (
                    <div key={p.data} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-linear-to-t from-[#04D939]/20 to-[#04D939]"
                        style={{
                          height: `${(p.minutosEstudados / maxMin) * 100}%`,
                          minHeight: p.minutosEstudados > 0 ? "8px" : "2px",
                        }}
                      />
                      <span className="text-[10px] uppercase text-[#8fa8c4]">
                        {weekDays[d.getDay()]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0a1522]/80 p-4">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
              Ciclos
            </p>
            <div className="flex h-44 items-end justify-between gap-2">
              {resumo.graficoCiclos.length === 0 ? (
                <p className="w-full text-center text-xs text-[#8fa8c4]">Sem dados ainda</p>
              ) : (
                resumo.graficoCiclos.map((p) => {
                  const d = new Date(p.data);
                  return (
                    <div key={p.data} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-full bg-linear-to-t from-[#04D939]/30 to-[#04D939]"
                        style={{
                          height: `${(p.ciclos / maxCic) * 100}%`,
                          minHeight: p.ciclos > 0 ? "8px" : "2px",
                        }}
                      />
                      <span className="text-[10px] uppercase text-[#8fa8c4]">
                        {weekDays[d.getDay()]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DadosPage() {
  return (
    <FocoPagesProvider>
      <FocoLayout activeTab="dados">
        <DadosContent />
      </FocoLayout>
    </FocoPagesProvider>
  );
}
