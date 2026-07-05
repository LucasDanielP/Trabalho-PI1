"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ConfiguracaoTimer } from "@/interfaces/Configuracao";

type TimerConfigContextValue = {
  configuracoes: ConfiguracaoTimer[];
  configAtiva: ConfiguracaoTimer | null;
  sidebarAberta: boolean;
  carregando: boolean;
  usuarioLogado: boolean;
  setSidebarAberta: (aberta: boolean) => void;
  selecionarConfig: (id: string) => void;
  recarregarConfigs: () => Promise<void>;
  criarConfig: (data: Omit<ConfiguracaoTimer, "id" | "ehPreset" | "tipo" | "usuarioId" | "criadoEm">) => Promise<void>;
  excluirConfig: (id: string) => Promise<void>;
};

const TimerConfigContext = createContext<TimerConfigContextValue | null>(null);

const CONFIG_ATIVA_KEY = "work-and-rest-config-ativa";

export function TimerConfigProvider({ children }: { children: ReactNode }) {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoTimer[]>([]);
  const [configAtivaId, setConfigAtivaId] = useState<string | null>(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  const recarregarConfigs = useCallback(async () => {
    const [configsRes, meRes] = await Promise.all([
      fetch("/api/configuracoes"),
      fetch("/api/auth/me"),
    ]);

    const configs = (await configsRes.json()) as ConfiguracaoTimer[];
    const me = await meRes.json();

    setConfiguracoes(configs);
    setUsuarioLogado(!!me.usuario);

    const salva = localStorage.getItem(CONFIG_ATIVA_KEY);
    const ativa =
      configs.find((c) => c.id === salva) ?? configs.find((c) => c.ehPreset) ?? configs[0];

    if (ativa) {
      setConfigAtivaId(ativa.id);
      localStorage.setItem(CONFIG_ATIVA_KEY, ativa.id);
    }
  }, []);

  useEffect(() => {
    recarregarConfigs().finally(() => setCarregando(false));
  }, [recarregarConfigs]);

  const configAtiva = useMemo(
    () => configuracoes.find((c) => c.id === configAtivaId) ?? null,
    [configuracoes, configAtivaId],
  );

  const selecionarConfig = useCallback((id: string) => {
    setConfigAtivaId(id);
    localStorage.setItem(CONFIG_ATIVA_KEY, id);
    setSidebarAberta(false);
  }, []);

  const criarConfig = useCallback(
    async (data: {
      nome: string;
      duracaoFocoMin: number;
      duracaoPausaCurtaMin: number;
      duracaoPausaLongaMin: number;
      ciclosAtePausaLonga: number;
    }) => {
      const res = await fetch("/api/configuracoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao criar configuração");
      }

      const nova = (await res.json()) as ConfiguracaoTimer;
      await recarregarConfigs();
      selecionarConfig(nova.id);
    },
    [recarregarConfigs, selecionarConfig],
  );

  const excluirConfig = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/configuracoes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao excluir");
      }
      await recarregarConfigs();
    },
    [recarregarConfigs],
  );

  return (
    <TimerConfigContext.Provider
      value={{
        configuracoes,
        configAtiva,
        sidebarAberta,
        carregando,
        usuarioLogado,
        setSidebarAberta,
        selecionarConfig,
        recarregarConfigs,
        criarConfig,
        excluirConfig,
      }}
    >
      {children}
    </TimerConfigContext.Provider>
  );
}

export function useTimerConfig() {
  const ctx = useContext(TimerConfigContext);
  if (!ctx) {
    throw new Error("useTimerConfig deve ser usado dentro de TimerConfigProvider");
  }
  return ctx;
}
