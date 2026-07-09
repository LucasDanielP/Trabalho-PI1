"use client";

import { useTimerConfig } from "@/components/providers/timer-config-provider";
import { useTimerState } from "@/components/providers/timer-state-provider";
import { TimerControls } from "@/components/foco/timer-controls";
import { PauseConfirmModal } from "@/components/foco/pause-confirm-modal";
import { TimerRing } from "@/components/foco/timer-ring";
import { duracaoFaseEmSegundos, formatarTempo, labelFase } from "@/lib/timer/engine";

export function TimerApp() {
  const { configAtiva, carregando: carregandoConfig } = useTimerConfig();
  const {
    estado,
    confirmacaoPausaAberta,
    handleReset,
    handleRequestPause,
    handleConfirmarPausa,
    handleCancelarPausa,
    handleResume,
    handleSkip,
  } = useTimerState();

  if (carregandoConfig || !configAtiva || !estado) {
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
