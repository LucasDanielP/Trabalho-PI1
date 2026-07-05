import type { FaseTimer } from "@/interfaces/Sessao";
import type { ConfiguracaoTimer } from "@/interfaces/Configuracao";

export type TimerEstado = {
  faseAtual: FaseTimer;
  cicloAtual: number;
  ciclosCompletos: number;
  tempoRestanteSeg: number;
  pausado: boolean;
};

export function duracaoFaseEmSegundos(
  fase: FaseTimer,
  config: Pick<
    ConfiguracaoTimer,
    "duracaoFocoMin" | "duracaoPausaCurtaMin" | "duracaoPausaLongaMin"
  >,
): number {
  switch (fase) {
    case "FOCO":
      return config.duracaoFocoMin * 60;
    case "PAUSA_CURTA":
      return config.duracaoPausaCurtaMin * 60;
    case "PAUSA_LONGA":
      return config.duracaoPausaLongaMin * 60;
  }
}

export function criarEstadoInicial(
  config: Pick<
    ConfiguracaoTimer,
    "duracaoFocoMin" | "duracaoPausaCurtaMin" | "duracaoPausaLongaMin"
  >,
): TimerEstado {
  return {
    faseAtual: "FOCO",
    cicloAtual: 1,
    ciclosCompletos: 0,
    tempoRestanteSeg: duracaoFaseEmSegundos("FOCO", config),
    pausado: false,
  };
}

export function avancarFase(
  estado: TimerEstado,
  config: Pick<ConfiguracaoTimer, "ciclosAtePausaLonga" | "duracaoFocoMin" | "duracaoPausaCurtaMin" | "duracaoPausaLongaMin">,
): TimerEstado {
  if (estado.faseAtual === "FOCO") {
    const ciclosCompletos = estado.ciclosCompletos + 1;
    const pausaLonga = ciclosCompletos % config.ciclosAtePausaLonga === 0;
    const faseAtual: FaseTimer = pausaLonga ? "PAUSA_LONGA" : "PAUSA_CURTA";

    return {
      faseAtual,
      cicloAtual: estado.cicloAtual,
      ciclosCompletos,
      tempoRestanteSeg: duracaoFaseEmSegundos(faseAtual, config),
      pausado: false,
    };
  }

  if (estado.faseAtual === "PAUSA_LONGA") {
    return {
      faseAtual: "FOCO",
      cicloAtual: 1,
      ciclosCompletos: estado.ciclosCompletos,
      tempoRestanteSeg: duracaoFaseEmSegundos("FOCO", config),
      pausado: false,
    };
  }

  return {
    faseAtual: "FOCO",
    cicloAtual: estado.cicloAtual + 1,
    ciclosCompletos: estado.ciclosCompletos,
    tempoRestanteSeg: duracaoFaseEmSegundos("FOCO", config),
    pausado: false,
  };
}

export function formatarTempo(segundos: number): string {
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function labelFase(fase: FaseTimer): string {
  switch (fase) {
    case "FOCO":
      return "Foco";
    case "PAUSA_CURTA":
      return "Pausa curta";
    case "PAUSA_LONGA":
      return "Pausa longa";
  }
}
