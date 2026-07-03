"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from "lucide-react";

import { mockConfiguracoes, mockSessoesEstudo } from "@/lib/mocks";
import type { ConfiguracaoTimer, SessaoEstudo } from "@/lib/types";

function formatHour(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

function calcularTempos(sessao: SessaoEstudo, config?: ConfiguracaoTimer) {
  if (!sessao.fim || !config) {
    return { ativo: 0, descanso: 0 };
  }

  const ativo = sessao.ciclosCompletos * config.duracaoFocoMin;
  const pausasCurtas = Math.max(0, sessao.ciclosCompletos - 1);
  const descanso =
    pausasCurtas * config.duracaoPausaCurtaMin +
    Math.floor(sessao.ciclosCompletos / config.ciclosAtePausaLonga) *
      config.duracaoPausaLongaMin;

  return { ativo, descanso };
}

export default function LogsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-full min-h-[500px] animate-pulse flex-col gap-4">
        <div className="h-10 rounded-full bg-[#112031]" />
        <div className="h-28 rounded-2xl bg-[#112031]" />
        <div className="h-28 rounded-2xl bg-[#112031]" />
        <div className="h-28 rounded-2xl bg-[#112031]" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[500px] flex-col justify-between">
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
          <Link
            href="/dados"
            className="rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
          >
            Dados
          </Link>
          <div className="rounded-full bg-[#04D939] px-8 py-2 text-sm font-bold text-[#012340]">
            Logs
          </div>
        </div>

        <div className="w-6" />
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {mockSessoesEstudo.map((sessao) => {
          const config = mockConfiguracoes.find(
            (item) => item.id === sessao.configuracaoId,
          );
          const { ativo, descanso } = calcularTempos(sessao, config);
          const dataRef = sessao.inicio;

          return (
            <article
              key={sessao.id}
              className="grid gap-6 rounded-2xl border border-white/5 bg-[#0d1826]/80 p-5 md:grid-cols-[120px_1fr_100px] md:items-center"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                  Ciclos concluídos
                </p>
                <div className="flex size-20 items-center justify-center rounded-full border-2 border-[#04D939] text-3xl font-bold text-white">
                  {sessao.ciclosCompletos}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                      Começou:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {formatHour(sessao.inicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                      Terminou:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {sessao.fim ? formatHour(sessao.fim) : "—"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                      Tempo ativo:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {formatDuration(ativo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fa8c4]">
                      Tempo descanso:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {formatDuration(descanso)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-end">
                <div className="text-center md:text-right">
                  <p className="text-4xl font-bold leading-none text-white">
                    {dataRef.toLocaleDateString("pt-BR", { day: "2-digit" })}
                  </p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#8fa8c4]">
                    {dataRef
                      .toLocaleDateString("pt-BR", { month: "long" })
                      .toUpperCase()}
                  </p>
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#8fa8c4]">
                    {dataRef.getFullYear()}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
