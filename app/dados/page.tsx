import {
  Coffee,
  Flame,
  History,
  RotateCcw,
  Timer,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";

const todayStats = [
  { icon: Timer, label: "Minutos trabalhados Hoje:", value: "35" },
  { icon: RotateCcw, label: "Ciclos Hoje:", value: "2" },
  { icon: Coffee, label: "Minutos Descansados:", value: "10" },
];

const historyStats = [
  { icon: Timer, label: "Tempo total de foco:", value: "12h 40min" },
  { icon: History, label: "Sessões concluídas:", value: "28" },
];

const weekDays = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
const minutesData = [20, 35, 15, 40, 28, 10, 35];
const cyclesData = [2, 3, 1, 4, 2, 1, 2];

export default function Dados() {
  return (
    <AppShell activeTab="dados">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="ds-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
              <Flame className="size-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Ofensiva atual
              </h2>
              <p className="text-sm text-muted-foreground">
                Série atual: 3 Dias
              </p>
            </div>
          </div>
        </section>

        <section className="ds-card p-6">
          <h2 className="ds-label mb-4">Histórico</h2>
          <ul className="space-y-4">
            {historyStats.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ds-card p-6 lg:col-span-2">
          <h2 className="ds-label mb-4">Hoje em Detalhes</h2>
          <ul className="divide-y divide-border/60">
            {todayStats.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ds-card p-6 lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Análise de Produtividade
            </h2>
            <div className="flex rounded-full bg-secondary/70 p-1">
              {["Semana", "Mês", "Ano"].map((period, index) => (
                <button
                  key={period}
                  type="button"
                  className={
                    index === 0
                      ? "rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-foreground"
                      : "rounded-full px-4 py-1.5 text-xs font-semibold text-muted-foreground"
                  }
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-background/40 p-4">
              <p className="ds-label mb-4">Minutos</p>
              <div className="flex h-44 items-end justify-between gap-2">
                {minutesData.map((value, index) => (
                  <div
                    key={weekDays[index]}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-lg bg-linear-to-t from-primary/20 to-primary"
                      style={{ height: `${(value / 40) * 100}%` }}
                    />
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {weekDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-background/40 p-4">
              <p className="ds-label mb-4">Ciclos</p>
              <div className="flex h-44 items-end justify-between gap-2">
                {cyclesData.map((value, index) => (
                  <div
                    key={weekDays[index]}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-full bg-linear-to-t from-primary/30 to-primary"
                      style={{ height: `${(value / 4) * 100}%` }}
                    />
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {weekDays[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
