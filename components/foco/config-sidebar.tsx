"use client";

import { useState } from "react";
import { Plus, X, Sidebar as SidebarIcon, Clock } from "lucide-react";
import Link from "next/link";

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
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    duracaoFocoMin: 25,
    duracaoPausaCurtaMin: 5,
    duracaoPausaLongaMin: 15,
    ciclosAtePausaLonga: 4,
  });

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

  async function handleExcluir(id: string) {
    try {
      await excluirConfig(id);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir timer");
    }
  }

  const presets = configuracoes.filter((c) => c.ehPreset);
  const custom = configuracoes.filter((c) => !c.ehPreset);
  const limiteAtingido = custom.length >= 5;

  return (
    <aside 
      className="flex flex-col h-full w-full rounded-[2rem] border border-white/5 p-6 sm:p-8 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(145deg, #162a3f 0%, #101d2d 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}
    >
      <div className="mb-6 flex items-center text-[#04D939]">
        <button 
          onClick={() => setSidebarAberta(false)} 
          className="transition-all hover:brightness-110"
        >
          <SidebarIcon size={24} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {presets.length > 0 && (
          <div className="mb-2">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4] opacity-70">Presets</p>
            <div className="flex flex-col gap-2">
              {presets.map((config) => {
                const isActive = configAtiva?.id === config.id;
                return (
                  <button 
                    key={config.id}
                    type="button" 
                    onClick={() => selecionarConfig(config.id)}
                    className={`flex items-center justify-between rounded-full border px-4 py-2.5 transition-all ${
                      isActive 
                        ? "border-[#04D939]/60 bg-[#04D939]/10 text-[#04D939]" 
                        : "border-white/10 bg-transparent text-[#8fa8c4] hover:border-[#04D939]/30 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 font-semibold text-[13px]">
                      <Clock size={15} />
                      <span>{config.duracaoFocoMin} | {String(config.duracaoPausaCurtaMin).padStart(2, '0')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-2">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#8fa8c4] opacity-70">Custom</p>
          <div className="flex flex-col gap-2">
            {custom.map((config) => {
              const isActive = configAtiva?.id === config.id;
              return (
                <div 
                  key={config.id}
                  className={`flex items-center justify-between rounded-full border px-4 py-2 transition-all ${
                    isActive 
                      ? "border-[#04D939]/60 bg-[#04D939]/10 text-[#04D939]" 
                      : "border-white/10 bg-transparent text-[#8fa8c4] hover:border-[#04D939]/30 hover:text-white"
                  }`}
                >
                  <button 
                    type="button" 
                    onClick={() => selecionarConfig(config.id)}
                    className="flex flex-1 items-center gap-3 font-semibold text-[13px]"
                  >
                    <Clock size={15} />
                    <span>{config.duracaoFocoMin} | {String(config.duracaoPausaCurtaMin).padStart(2, '0')}</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => handleExcluir(config.id)}
                    className="ml-2 rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-[#ff8a8a]"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>


        {!usuarioLogado && (
          <p className="mt-2 text-center text-xs text-[#8fa8c4] opacity-80">
            <Link href="/login" className="text-[#04D939] hover:underline">Faça login</Link> para criar novos.
          </p>
        )}

        {usuarioLogado && mostrarForm && (
          <form onSubmit={handleCriar} className="mt-4 space-y-3 rounded-2xl border border-[#04D939]/30 bg-[#0d1826]/50 p-4 text-xs">
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-center text-white placeholder-white/30"
              placeholder="Nome do Timer"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                type="number"
                min={1}
                value={form.duracaoFocoMin}
                onChange={(e) => setForm({...form, duracaoFocoMin: Number(e.target.value)})}
                className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-center text-white"
                placeholder="Foco"
                title="Minutos de Foco"
              />
              <input
                required
                type="number"
                min={1}
                value={form.duracaoPausaCurtaMin}
                onChange={(e) => setForm({...form, duracaoPausaCurtaMin: Number(e.target.value)})}
                className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-center text-white"
                placeholder="P. Curta"
                title="Minutos de Pausa Curta"
              />
              <input
                required
                type="number"
                min={1}
                value={form.duracaoPausaLongaMin}
                onChange={(e) => setForm({...form, duracaoPausaLongaMin: Number(e.target.value)})}
                className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-center text-white"
                placeholder="P. Longa"
                title="Minutos de Pausa Longa"
              />
              <input
                required
                type="number"
                min={1}
                value={form.ciclosAtePausaLonga}
                onChange={(e) => setForm({...form, ciclosAtePausaLonga: Number(e.target.value)})}
                className="w-full rounded-md border border-white/10 bg-transparent px-2 py-1.5 text-center text-white"
                placeholder="Ciclos"
                title="Ciclos até a Pausa Longa"
              />
            </div>
            {erro && <p className="text-[10px] text-[#ff8a8a]">{erro}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={salvando} className="flex-1 rounded-full bg-[#04D939] py-2 font-bold text-[#012340]">OK</button>
              <button type="button" onClick={() => setMostrarForm(false)} className="flex-1 rounded-full border border-white/20 py-2 text-[#8fa8c4]">Canc.</button>
            </div>
          </form>
        )}

        {usuarioLogado && !mostrarForm && !limiteAtingido && (
          <button 
            type="button"
            onClick={() => setMostrarForm(true)}
            className="group mt-4 flex w-full items-center justify-center text-white transition-all hover:text-[#04D939]"
          >
            <Plus size={20} strokeWidth={2.5} className="transition-transform group-hover:scale-125" />
          </button>
        )}

        {usuarioLogado && !mostrarForm && limiteAtingido && (
          <p className="mt-4 text-center text-[10px] text-[#ff8a8a] opacity-80">
            Limite de 5 timers atingido.
          </p>
        )}
      </div>
    </aside>
  );
}
