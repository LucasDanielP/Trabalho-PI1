"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, X } from "lucide-react";

import { useTimerConfig } from "@/components/providers/timer-config-provider";

export function ConfigSidebar() {
  const {
    configuracoes,
    configAtiva,
    sidebarAberta,
    setSidebarAberta,
    selecionarConfig,
    criarConfig,
    excluirConfig,
    usuarioLogado,
  } = useTimerConfig();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    duracaoFocoMin: 25,
    duracaoPausaCurtaMin: 5,
    duracaoPausaLongaMin: 15,
    ciclosAtePausaLonga: 4,
  });

  if (!sidebarAberta) return null;

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await criarConfig(form);
      setMostrarForm(false);
      setForm({
        nome: "",
        duracaoFocoMin: 25,
        duracaoPausaCurtaMin: 5,
        duracaoPausaLongaMin: 15,
        ciclosAtePausaLonga: 4,
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  }

  const presets = configuracoes.filter((c) => c.ehPreset);
  const custom = configuracoes.filter((c) => !c.ehPreset);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setSidebarAberta(false)}
        aria-hidden
      />

      <aside className="fixed left-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-[#0d1826] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="font-bold text-white">Timers</h2>
            <p className="text-xs text-[#8fa8c4]">Presets e personalizados</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarAberta(false)}
            className="rounded-full p-1 text-[#8fa8c4] hover:text-white"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4]">
            Pré-definidos
          </p>
          <ul className="mb-6 space-y-2">
            {presets.map((config) => (
              <li key={config.id}>
                <button
                  type="button"
                  onClick={() => selecionarConfig(config.id)}
                  className={
                    configAtiva?.id === config.id
                      ? "w-full rounded-xl border border-[#04D939]/50 bg-[#04D939]/15 p-3 text-left"
                      : "w-full rounded-xl border border-white/5 bg-[#112031] p-3 text-left transition-colors hover:border-[#04D939]/30"
                  }
                >
                  <p className="font-semibold text-white">{config.nome}</p>
                  <p className="mt-1 text-xs text-[#8fa8c4]">
                    {config.duracaoFocoMin}min foco · {config.duracaoPausaCurtaMin}/
                    {config.duracaoPausaLongaMin}min pausa · {config.ciclosAtePausaLonga} ciclos
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {custom.length > 0 ? (
            <>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4]">
                Meus timers
              </p>
              <ul className="mb-4 space-y-2">
                {custom.map((config) => (
                  <li key={config.id} className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selecionarConfig(config.id)}
                      className={
                        configAtiva?.id === config.id
                          ? "flex-1 rounded-xl border border-[#04D939]/50 bg-[#04D939]/15 p-3 text-left"
                          : "flex-1 rounded-xl border border-white/5 bg-[#112031] p-3 text-left transition-colors hover:border-[#04D939]/30"
                      }
                    >
                      <p className="font-semibold text-white">{config.nome}</p>
                      <p className="mt-1 text-xs text-[#8fa8c4]">
                        {config.duracaoFocoMin}/{config.duracaoPausaCurtaMin}/
                        {config.duracaoPausaLongaMin} min
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => excluirConfig(config.id)}
                      className="rounded-xl border border-white/5 px-3 text-[#ff8a8a] hover:bg-[#BC2F32]/10"
                      aria-label="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {!usuarioLogado ? (
            <p className="mb-4 rounded-xl border border-white/5 bg-[#112031] p-3 text-xs text-[#8fa8c4]">
              <Link href="/login" className="text-[#04D939] hover:underline">
                Faça login
              </Link>{" "}
              para criar timers personalizados e salvar seu histórico.
            </p>
          ) : null}

          {usuarioLogado && !mostrarForm ? (
            <button
              type="button"
              onClick={() => setMostrarForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#04D939]/40 py-3 text-sm font-semibold text-[#04D939] hover:bg-[#04D939]/10"
            >
              <Plus size={16} />
              Novo timer
            </button>
          ) : null}

          {usuarioLogado && mostrarForm ? (
            <form onSubmit={handleCriar} className="space-y-3 rounded-xl border border-white/5 bg-[#112031] p-4">
              <input
                required
                placeholder="Nome do timer"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0d1826] px-3 py-2 text-sm text-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="text-[#8fa8c4]">
                  Foco (min)
                  <input
                    type="number"
                    min={1}
                    value={form.duracaoFocoMin}
                    onChange={(e) =>
                      setForm({ ...form, duracaoFocoMin: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d1826] px-2 py-1.5 text-white"
                  />
                </label>
                <label className="text-[#8fa8c4]">
                  Pausa curta
                  <input
                    type="number"
                    min={1}
                    value={form.duracaoPausaCurtaMin}
                    onChange={(e) =>
                      setForm({ ...form, duracaoPausaCurtaMin: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d1826] px-2 py-1.5 text-white"
                  />
                </label>
                <label className="text-[#8fa8c4]">
                  Pausa longa
                  <input
                    type="number"
                    min={1}
                    value={form.duracaoPausaLongaMin}
                    onChange={(e) =>
                      setForm({ ...form, duracaoPausaLongaMin: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d1826] px-2 py-1.5 text-white"
                  />
                </label>
                <label className="text-[#8fa8c4]">
                  Ciclos
                  <input
                    type="number"
                    min={1}
                    value={form.ciclosAtePausaLonga}
                    onChange={(e) =>
                      setForm({ ...form, ciclosAtePausaLonga: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#0d1826] px-2 py-1.5 text-white"
                  />
                </label>
              </div>
              {erro ? <p className="text-xs text-[#ff8a8a]">{erro}</p> : null}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 rounded-full bg-[#04D939] py-2 text-sm font-bold text-[#012340] disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#8fa8c4]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </aside>
    </>
  );
}
