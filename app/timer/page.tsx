"use client";

import Link from "next/link";
import { Sidebar, RotateCcw, Pause, Play, StepForward } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Fase = "FOCO" | "PAUSA_CURTA" | "PAUSA_LONGA";

interface Configuracao {
  id: string;
  nome: string;
  duracaoFocoMin: number;
  duracaoPausaCurtaMin: number;
  duracaoPausaLongaMin: number;
  ciclosAtePausaLonga: number;
}

export default function Timer() {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [configAtual, setConfigAtual] = useState<Configuracao | null>(null);
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const [fase, setFase] = useState<Fase>("FOCO");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ciclos, setCiclos] = useState(0);

  const [sessaoInicio, setSessaoInicio] = useState<Date | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [customTempoTotal, setCustomTempoTotal] = useState<number | null>(null);

  // Buscar configurações ao carregar
  useEffect(() => {
    fetch("/api/configuracoes")
      .then((res) => res.json())
      .then((data: Configuracao[]) => {
        setConfiguracoes(data);
        if (data.length > 0) {
          selecionarConfig(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const selecionarConfig = (config: Configuracao) => {
    setConfigAtual(config);
    setFase("FOCO");
    setTimeLeft(config.duracaoFocoMin * 60);
    setIsActive(false);
    setCiclos(0);
    setSessaoInicio(null);
    setShowConfigMenu(false);
    setCustomTempoTotal(null);
  };

  // Logica do Timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      avancarFase();
    }
    return () => clearInterval(intervalRef.current!);
  }, [isActive, timeLeft]);

  const avancarFase = async () => {
    if (!configAtual) return;
    setCustomTempoTotal(null);

    let proximaFase: Fase = "FOCO";
    let proximoTempo = configAtual.duracaoFocoMin * 60;
    let novosCiclos = ciclos;

    if (fase === "FOCO") {
      novosCiclos += 1;
      setCiclos(novosCiclos);
      
      // Salva sessão no banco
      if (sessaoInicio) {
        try {
          await fetch("/api/sessoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              configuracaoId: configAtual.id,
              inicio: sessaoInicio.toISOString(),
              fim: new Date().toISOString(),
              ciclosCompletos: novosCiclos,
            }),
          });
        } catch (e) {
          console.error("Erro ao salvar sessão", e);
        }
      }

      if (novosCiclos % configAtual.ciclosAtePausaLonga === 0) {
        proximaFase = "PAUSA_LONGA";
        proximoTempo = configAtual.duracaoPausaLongaMin * 60;
      } else {
        proximaFase = "PAUSA_CURTA";
        proximoTempo = configAtual.duracaoPausaCurtaMin * 60;
      }
    } else {
      // Estava na pausa, volta pro foco
      proximaFase = "FOCO";
      proximoTempo = configAtual.duracaoFocoMin * 60;
      setSessaoInicio(new Date());
    }

    setFase(proximaFase);
    setTimeLeft(proximoTempo);
  };

  const toggleTimer = () => {
    if (!isActive && fase === "FOCO" && !sessaoInicio) {
      setSessaoInicio(new Date());
    }
    setIsActive(!isActive);
    setIsEditingTime(false);
  };

  const resetTimer = () => {
    if (!configAtual) return;
    setIsActive(false);
    setFase("FOCO");
    setTimeLeft(configAtual.duracaoFocoMin * 60);
    setSessaoInicio(null);
    setCustomTempoTotal(null);
    setIsEditingTime(false);
  };

  const handleTimeClick = () => {
    if (!isActive) {
      setEditInput(timeString);
      setIsEditingTime(true);
    }
  };

  const handleTimeSubmit = (e?: React.FormEvent | React.FocusEvent) => {
    if (e) e.preventDefault();
    setIsEditingTime(false);
    
    const parts = editInput.split(":");
    let newTime = 0;
    
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const s = parseInt(parts[1], 10);
      if (!isNaN(m) && !isNaN(s)) newTime = (m * 60) + s;
    } else if (parts.length === 1) {
      const m = parseInt(parts[0], 10);
      if (!isNaN(m)) newTime = m * 60;
    }
    
    if (newTime > 0) {
      setTimeLeft(newTime);
      setCustomTempoTotal(newTime);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleTimeSubmit();
    if (e.key === "Escape") setIsEditingTime(false);
  };

  // Formatação do tempo
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Calculo de progresso circular
  let tempoTotalFase = customTempoTotal || 25 * 60;
  if (!customTempoTotal && configAtual) {
    if (fase === "FOCO") tempoTotalFase = configAtual.duracaoFocoMin * 60;
    if (fase === "PAUSA_CURTA") tempoTotalFase = configAtual.duracaoPausaCurtaMin * 60;
    if (fase === "PAUSA_LONGA") tempoTotalFase = configAtual.duracaoPausaLongaMin * 60;
  }
  const maxDashOffset = 753.98;
  const progress = Math.min(Math.max(timeLeft / tempoTotalFase, 0), 1);
  const strokeDashoffset = maxDashOffset * (1 - progress);

  return (
    <div className="flex flex-col h-full justify-between">
      
      {/* Barra Superior */}
      <div className="relative z-10 flex items-center justify-between mb-16">
        {/* Ícone Sidebar */}
        <div className="relative">
          <button 
            onClick={() => setShowConfigMenu(!showConfigMenu)}
            className="text-[#04D939] hover:brightness-110 transition-all"
          >
            <Sidebar size={24} strokeWidth={2} />
          </button>
          
          {showConfigMenu && (
            <div className="absolute top-8 left-0 w-64 bg-[#112031] border border-[#04D939]/30 rounded-xl p-4 shadow-xl z-50">
              <h3 className="text-white font-semibold mb-3 text-sm">Configurações de Timer</h3>
              <div className="flex flex-col gap-2">
                {configuracoes.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => selecionarConfig(c)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${configAtual?.id === c.id ? 'bg-[#04D939]/20 text-[#04D939] border border-[#04D939]/50' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    {c.nome} <span className="text-xs opacity-60">({c.duracaoFocoMin}/{c.duracaoPausaCurtaMin})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Abas Centrais */}
        <div className="flex gap-4 absolute left-1/2 -translate-x-1/2">
          <div className="px-8 py-2 rounded-full text-sm font-bold bg-[#04D939] text-[#012340]">
            Foco
          </div>
          <Link href="/dados" className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white">
            Dados
          </Link>
          <Link href="/logs" className="px-8 py-2 rounded-full text-sm font-semibold transition-colors bg-[#112031] text-gray-400 hover:text-white">
            Logs
          </Link>
        </div>

        <div className="w-6"></div>
      </div>

      {/* Fase Atual */}
      <div className="text-center mb-2 animate-in fade-in zoom-in duration-300">
        <span className="text-[#04D939] font-semibold tracking-[0.2em] text-sm uppercase">
          {fase === "FOCO" ? "Foco Total" : fase === "PAUSA_CURTA" ? "Pausa Curta" : "Pausa Longa"}
        </span>
        <div className="text-white/50 text-xs mt-1">Ciclo {ciclos + 1}</div>
      </div>

      {/* Relógio Circular (Timer) */}
      <div className="relative flex items-center justify-center mb-16 mt-4">
        <svg className="w-72 h-72 transform -rotate-90 transition-all duration-1000" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4))' }}>
          <defs>
            <filter id="inner-shadow">
              <feOffset dx="0" dy="5"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.6" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>

          <circle cx="144" cy="144" r="120" stroke="#0a3f24" strokeWidth="16" fill="transparent" />
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke={fase === "FOCO" ? "#04D939" : "#3b82f6"} // Azul na pausa
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={maxDashOffset}
            strokeDashoffset={strokeDashoffset}
            filter="url(#inner-shadow)"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          {isEditingTime ? (
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              onBlur={handleTimeSubmit}
              onKeyDown={handleKeyDown}
              className="text-white text-5xl font-semibold tracking-wide tabular-nums bg-transparent border-b-2 border-[#04D939] text-center w-36 outline-none"
              autoFocus
            />
          ) : (
            <span 
              onClick={handleTimeClick}
              className={`text-white text-5xl font-semibold tracking-wide tabular-nums ${!isActive ? 'cursor-pointer hover:text-[#04D939] transition-colors' : ''}`}
              title={!isActive ? "Clique para editar o tempo" : ""}
            >
              {timeString}
            </span>
          )}
        </div>
      </div>

      {/* Controles do Timer */}
      <div className="flex justify-center items-center gap-6 w-full mb-4">
        <button onClick={resetTimer} className="w-32 border border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:bg-[#04D939]/25 active:bg-[#04D939]/40 rounded-full py-2.5 font-medium transition-all flex items-center justify-center cursor-pointer">
          <RotateCcw size={20} strokeWidth={2} />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-40 border rounded-full py-2.5 font-medium transition-all flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer ${
            isActive 
              ? "border-[#BC2F32] text-[#BC2F32] bg-[#BC2F32]/10 hover:bg-[#BC2F32]/15 active:bg-[#BC2F32]/30" 
              : "border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:bg-[#04D939]/20 active:bg-[#04D939]/30"
          }`}
        >
          {isActive ? (
            <>
              <Pause size={18} fill="currentColor" strokeWidth={0} /> PAUSAR
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" strokeWidth={0} /> COMEÇAR
            </>
          )}
        </button>

        <button onClick={avancarFase} className="w-32 border border-[#04D939] text-[#04D939] bg-[#04D939]/10 hover:bg-[#04D939]/25 active:bg-[#04D939]/40 rounded-full py-2.5 font-medium transition-all flex items-center justify-center cursor-pointer">
          <StepForward size={20} strokeWidth={2} />
        </button>
      </div>

    </div>
  );
}
