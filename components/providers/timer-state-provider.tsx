"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useTimerConfig } from "./timer-config-provider";
import {
  avancarFase,
  criarEstadoInicial,
  type TimerEstado,
} from "@/lib/timer/engine";
import {
  createGuestSessao,
  saveGuestSessao,
} from "@/lib/sessao/guest-storage";
import type { SessaoEstudo } from "@/interfaces/Sessao";

type TimerStateContextValue = {
  estado: TimerEstado | null;
  confirmacaoPausaAberta: boolean;
  handleReset: () => void;
  handleRequestPause: () => void;
  handleConfirmarPausa: () => void;
  handleCancelarPausa: () => void;
  handleResume: () => void;
  handleSkip: () => void;
};

const TimerStateContext = createContext<TimerStateContextValue | null>(null);

export function TimerStateProvider({ children }: { children: ReactNode }) {
  const { configAtiva, carregando, usuarioLogado } = useTimerConfig();
  const [estado, setEstado] = useState<TimerEstado | null>(null);
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [sessaoGuest, setSessaoGuest] = useState<SessaoEstudo | null>(null);
  const [confirmacaoPausaAberta, setConfirmacaoPausaAberta] = useState(false);
  const [loadedConfigId, setLoadedConfigId] = useState<string | null>(null);

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
    if (carregando || !configAtiva) return;
    
    // Para evitar reiniciar o timer em re-renders não relacionados,
    // só reiniciamos quando a configuração ativa realmente mudar (ou no primeiro load).
    if (loadedConfigId === configAtiva.id && estado !== null) return;
    
    setLoadedConfigId(configAtiva.id);
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
  }, [configAtiva, carregando, usuarioLogado, loadedConfigId, estado]);

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

  return (
    <TimerStateContext.Provider
      value={{
        estado,
        confirmacaoPausaAberta,
        handleReset,
        handleRequestPause,
        handleConfirmarPausa,
        handleCancelarPausa,
        handleResume,
        handleSkip,
      }}
    >
      {children}
    </TimerStateContext.Provider>
  );
}

export function useTimerState() {
  const ctx = useContext(TimerStateContext);
  if (!ctx) {
    throw new Error("useTimerState deve ser usado dentro de TimerStateProvider");
  }
  return ctx;
}
