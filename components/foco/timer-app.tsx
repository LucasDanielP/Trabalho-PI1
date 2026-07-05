"use client";

import { useCallback, useEffect, useState } from "react";

import { useTimerConfig } from "@/components/providers/timer-config-provider";
import { TimerControls } from "@/components/foco/timer-controls";
import { PauseConfirmModal } from "@/components/foco/pause-confirm-modal";
import { TimerRing } from "@/components/foco/timer-ring";
import {
  avancarFase,
  criarEstadoInicial,
  duracaoFaseEmSegundos,
  formatarTempo,
  labelFase,
  type TimerEstado,
} from "@/lib/timer/engine";
import {
  createGuestSessao,
  saveGuestSessao,
} from "@/lib/sessao/guest-storage";
import type { SessaoEstudo } from "@/interfaces/Sessao";

export function TimerApp() {
  const { configAtiva, carregando, usuarioLogado } = useTimerConfig();
  const [estado, setEstado] = useState<TimerEstado | null>(null);
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [sessaoGuest, setSessaoGuest] = useState<SessaoEstudo | null>(null);
  const [confirmacaoPausaAberta, setConfirmacaoPausaAberta] = useState(false);

  const persistirSessao = useCallback(
    async (novoEstado: TimerEstado) => {
      const payload = {
        ciclosCompletos: novoEstado.ciclosCompletos,
        faseAtual: novoEstado.faseAtual,
        cicloAtual: novoEstado.cicloAtual,
      };

      if (usuarioLogado && sessaoId) {
        await fetch(`/api/sessoes/${sessaoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (sessaoGuest) {
        const atualizada: SessaoEstudo = { ...sessaoGuest, ...payload };
        setSessaoGuest(atualizada);
        saveGuestSessao(atualizada);
      }
    },
    [usuarioLogado, sessaoId, sessaoGuest],
  );

  useEffect(() => {
    if (!configAtiva) return;

    setEstado(criarEstadoInicial(configAtiva));
    setSessaoId(null);
    setSessaoGuest(null);

    async function iniciarSessao() {
      if (usuarioLogado) {
        const res = await fetch("/api/sessoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ configuracaoId: configAtiva!.id }),
        });
        if (res.ok) {
          const sessao = (await res.json()) as SessaoEstudo;
          setSessaoId(sessao.id);
        }
      } else {
        const guest = createGuestSessao(configAtiva!.id, {
          id: configAtiva!.id,
          nome: configAtiva!.nome,
          duracaoFocoMin: configAtiva!.duracaoFocoMin,
          duracaoPausaCurtaMin: configAtiva!.duracaoPausaCurtaMin,
          duracaoPausaLongaMin: configAtiva!.duracaoPausaLongaMin,
          ciclosAtePausaLonga: configAtiva!.ciclosAtePausaLonga,
        });
        setSessaoGuest(guest);
        saveGuestSessao(guest);
      }
    }

    iniciarSessao();
  }, [configAtiva?.id, usuarioLogado]);

  useEffect(() => {
    if (!estado || estado.pausado || !configAtiva) return;

    const interval = setInterval(() => {
      setEstado((prev) => {
        if (!prev || prev.pausado) return prev;

        if (prev.tempoRestanteSeg <= 1) {
          const proximo = avancarFase(prev, configAtiva);
          persistirSessao(proximo);
          return proximo;
        }

        return { ...prev, tempoRestanteSeg: prev.tempoRestanteSeg - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [estado?.pausado, configAtiva, persistirSessao]);

  function handleReset() {
    if (!configAtiva) return;
    const novo = criarEstadoInicial(configAtiva);
    setEstado(novo);
    persistirSessao(novo);
  }

  function handleRequestPause() {
    setConfirmacaoPausaAberta(true);
  }

  function handleConfirmarPausa() {
    setConfirmacaoPausaAberta(false);
    setEstado((prev) => (prev ? { ...prev, pausado: true } : prev));
  }

  function handleCancelarPausa() {
    setConfirmacaoPausaAberta(false);
  }

  function handleResume() {
    setEstado((prev) => (prev ? { ...prev, pausado: false } : prev));
  }

  function handleSkip() {
    if (!configAtiva || !estado) return;
    const proximo = avancarFase(estado, configAtiva);
    setEstado(proximo);
    persistirSessao(proximo);
  }

  if (carregando || !configAtiva || !estado) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <div className="h-72 w-72 animate-pulse rounded-full bg-[#112031]" />
        <p className="text-sm text-[#8fa8c4]">Carregando timer...</p>
      </div>
    );
  }

  const duracaoTotal = duracaoFaseEmSegundos(estado.faseAtual, configAtiva);
  const progresso =
    duracaoTotal > 0
      ? (duracaoTotal - estado.tempoRestanteSeg) / duracaoTotal
      : 0;

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="mb-4 text-center">
        <p className="text-xs text-[#8fa8c4]">Timer ativo</p>
        <p className="font-semibold text-white">{configAtiva.nome}</p>
      </div>

      <div className="relative mb-16 mt-4 flex items-center justify-center">
        <TimerRing
          progresso={progresso}
          tempo={formatarTempo(estado.tempoRestanteSeg)}
          faseLabel={labelFase(estado.faseAtual)}
          cicloLabel={`Ciclo ${estado.cicloAtual} · ${estado.ciclosCompletos} concluídos`}
        />
      </div>

      <TimerControls
        pausado={estado.pausado}
        confirmacaoPausaAberta={confirmacaoPausaAberta}
        onReset={handleReset}
        onRequestPause={handleRequestPause}
        onResume={handleResume}
        onSkip={handleSkip}
      />

      <PauseConfirmModal
        aberto={confirmacaoPausaAberta}
        onConfirmar={handleConfirmarPausa}
        onVoltar={handleCancelarPausa}
      />
    </div>
  );
}
