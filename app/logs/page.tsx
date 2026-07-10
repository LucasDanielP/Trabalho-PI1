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
    <div className="flex max-h-[420px] flex-1 flex-col gap-4 overflow-y-auto pr-1">
      {diasAgrupados.map((dia) => {
        return (
          <article
            key={dia.data.toDateString()}
            className="grid gap-6 rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5 md:grid-cols-[120px_1fr_100px] md:items-center"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                Ciclos totais
              </p>
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-[#04D939] text-3xl font-bold text-white">
                {dia.ciclosCompletos}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                    Sessões no dia:
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {dia.sessoes} {dia.sessoes === 1 ? "sessão" : "sessões"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                    Tempo ativo:
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {formatDuration(dia.minutosFoco)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                    Tempo descanso:
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {formatDuration(dia.minutosDescanso)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold leading-none text-white">
                  {dia.data.toLocaleDateString("pt-BR", { day: "2-digit" })}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#8fa8c4]">
                  {dia.data
                    .toLocaleDateString("pt-BR", { month: "long" })
                    .toUpperCase()}
                </p>
              </div>
            </div>
          </article>
        );
      })}
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
