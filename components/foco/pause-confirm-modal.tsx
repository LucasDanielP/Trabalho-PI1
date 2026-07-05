"use client";

import { AlertTriangle, ArrowLeft, Hand } from "lucide-react";

type PauseConfirmModalProps = {
  aberto: boolean;
  onConfirmar: () => void;
  onVoltar: () => void;
};

export function PauseConfirmModal({
  aberto,
  onConfirmar,
  onVoltar,
}: PauseConfirmModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onVoltar}
        aria-hidden
      />

      <div
        role="alertdialog"
        aria-labelledby="pause-aviso-titulo"
        aria-describedby="pause-aviso-descricao"
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#BC2F32] bg-[#2a1218]/95 p-6 shadow-[0_0_40px_rgba(188,47,50,0.25)]"
      >
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="size-5 text-[#f5a623]" fill="#f5a623" strokeWidth={0} />
          <h2
            id="pause-aviso-titulo"
            className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff8a8a]"
          >
            Aviso
          </h2>
        </div>

        <p
          id="pause-aviso-descricao"
          className="mb-6 text-center text-sm leading-relaxed text-white"
        >
          Tem certeza que deseja interromper a sua sessão de estudos?
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirmar}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#BC2F32] py-3 text-xs font-bold uppercase tracking-wide text-white transition-all hover:brightness-110"
          >
            Confirmar pausa
            <Hand size={16} />
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d45a5a] py-3 text-xs font-bold uppercase tracking-wide text-white transition-all hover:brightness-110"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
