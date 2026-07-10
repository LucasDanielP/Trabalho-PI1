"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { FocoLayout } from "@/components/layout/foco-nav";
import {
  calcularTempos,
  formatDuration,
} from "@/lib/sessao/calculos";
import { getGuestSessoes } from "@/lib/sessao/guest-storage";
import type { SessaoEstudo } from "@/interfaces/Sessao";

function LogsContent() {
  const [sessoes, setSessoes] = useState<SessaoEstudo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();

      if (me.usuario) {
        const res = await fetch("/api/sessoes");
        setSessoes(await res.json());
      } else {
        setIsGuest(true);
      }
      setCarregando(false);
    }
    load();
  }, []);

  const diasAgrupados = useMemo(() => {
    const map = new Map<string, {
      data: Date;
      ciclosCompletos: number;
      minutosFoco: number;
      minutosDescanso: number;
      sessoes: number;
    }>();

    for (const sessao of sessoes) {
      const config = sessao.configuracao;
      const { ativo, descanso } = calcularTempos(sessao, config);
      
      // Ignora sessões fantasmas que nunca saíram do 0
      if (sessao.ciclosCompletos === 0 && ativo === 0) continue;

      const d = new Date(sessao.inicio);
      const key = d.toDateString();

      const atual = map.get(key) || {
        data: d,
        ciclosCompletos: 0,
        minutosFoco: 0,
        minutosDescanso: 0,
        sessoes: 0,
      };

      atual.ciclosCompletos += sessao.ciclosCompletos;
      atual.minutosFoco += ativo;
      atual.minutosDescanso += descanso;
      atual.sessoes += 1;

      map.set(key, atual);
    }

    return Array.from(map.values()).sort((a, b) => b.data.getTime() - a.data.getTime());
  }, [sessoes]);

  const mesesAgrupados = useMemo(() => {
    const map = new Map<string, typeof diasAgrupados>();
    
    for (const dia of diasAgrupados) {
      const monthName = dia.data.toLocaleDateString("pt-BR", { month: "long" });
      const year = dia.data.getFullYear();
      const key = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
      
      const list = map.get(key) || [];
      list.push(dia);
      map.set(key, list);
    }
    
    return Array.from(map.entries()).map(([mes, dias]) => ({ mes, dias }));
  }, [diasAgrupados]);

  if (carregando) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-28 animate-pulse rounded-2xl bg-[#112031]" />
        <div className="h-28 animate-pulse rounded-2xl bg-[#112031]" />
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-lg font-semibold text-white">Faça Login para ver seus logs</p>
        <p className="mt-2 text-sm text-[#8fa8c4]">
          Seu histórico de estudos fica salvo na nuvem de forma segura.
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



  if (diasAgrupados.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
        <p className="text-[#8fa8c4]">Nenhum ciclo concluído ainda.</p>
        <p className="mt-2 text-sm text-[#8fa8c4]">
          Inicie um timer em Foco para ver seu histórico aqui.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="flex h-[500px] w-full flex-col gap-8 overflow-y-auto pr-2 pb-10 pt-4 scroll-smooth"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)"
      }}
    >
      {mesesAgrupados.map((grupo) => (
        <section key={grupo.mes} className="flex flex-col gap-4">
          <div className="sticky top-0 z-20 flex justify-center pb-2">
            <h2 className="rounded-full bg-[#132235]/90 px-6 py-1.5 text-[10px] font-bold tracking-widest uppercase text-[#04D939] shadow-md backdrop-blur-md border border-white/5">
              {grupo.mes}
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {grupo.dias.map((dia) => (
              <article
                key={dia.data.toDateString()}
                className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0d1826] p-6 md:px-10 grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center shadow-lg"
              >
                {/* Ciclos */}
                <div className="relative z-10 flex flex-col items-center gap-2 text-center md:pr-6 md:border-r md:border-white/5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4]">Ciclos</p>
                  <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#04D939]/20 to-[#04D939]/5 border border-[#04D939]/30 text-2xl font-bold text-[#04D939] shadow-[0_0_15px_rgba(4,217,57,0.15)]">
                    {dia.ciclosCompletos}
                  </div>
                </div>

                {/* Tempos e Sessões */}
                <div className="relative z-10 grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4]">Desempenho</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#8fa8c4] w-12">Foco:</span>
                        <span className="font-semibold text-white">{formatDuration(dia.minutosFoco)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#8fa8c4] w-12">Pausa:</span>
                        <span className="font-semibold text-white">{formatDuration(dia.minutosDescanso)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4]">Sessões no dia</p>
                    <div className="mt-1 text-2xl font-bold text-white flex items-baseline gap-2">
                      {dia.sessoes} <span className="text-sm font-medium text-[#8fa8c4]">{dia.sessoes === 1 ? "sessão" : "sessões"}</span>
                    </div>
                  </div>
                </div>

                {/* Data */}
                <div className="relative z-10 flex flex-col items-center justify-center md:items-end md:pl-8 md:border-l md:border-white/5">
                  <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                    {dia.data.toLocaleDateString("pt-BR", { day: "2-digit" })}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8fa8c4] mt-1">
                    {dia.data.toLocaleDateString("pt-BR", { month: "short" }).replace('.', '')} {dia.data.getFullYear()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function LogsPage() {
  return (
    <FocoLayout activeTab="logs">
      <LogsContent />
    </FocoLayout>
  );
}
