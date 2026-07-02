"use client";

import { useEffect, useState } from "react";
import { mockSessoesEstudo, mockConfiguracoes } from "@/lib/mocks";
import { Clock, Calendar, CheckCircle2, Timer } from "lucide-react";

export default function LogsPage() {
  // Evita erro de hidratação (hydration mismatch) com datas do lado do servidor vs cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="max-w-4xl mx-auto p-6 md:p-10 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-10"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Logs de Estudo</h1>
        <p className="text-muted-foreground text-slate-500">Histórico das suas sessões de foco e produtividade.</p>
      </div>

      <div className="space-y-4">
        {mockSessoesEstudo.map((sessao) => {
          const config = mockConfiguracoes.find((c) => c.id === sessao.configuracaoId);
          
          return (
            <div 
              key={sessao.id} 
              className="flex flex-col md:flex-row bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg mt-1">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {sessao.inicio.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <Clock className="w-4 h-4" />
                      {sessao.inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                      {sessao.fim ? ` até ${sessao.fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : " (Em andamento)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 md:mt-0 md:pl-8 md:border-l border-slate-100 dark:border-slate-800 gap-8">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Ciclos
                  </span>
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {sessao.ciclosCompletos}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                    <Timer className="w-4 h-4 text-indigo-500" />
                    Configuração
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {config?.nome || "Desconhecida"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
