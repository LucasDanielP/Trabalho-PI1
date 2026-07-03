import { AppShell } from "@/components/layout/app-shell";

const logs = [
  {
    cycles: 3,
    started: "09:30",
    finished: "11:04",
    active: "48 min",
    rest: "17 min",
    day: "03",
    month: "MAIO",
    year: "2026",
  },
  {
    cycles: 17,
    started: "14:10",
    finished: "18:45",
    active: "3h 12min",
    rest: "45 min",
    day: "02",
    month: "MAIO",
    year: "2026",
  },
  {
    cycles: 8,
    started: "08:00",
    finished: "10:20",
    active: "1h 52min",
    rest: "28 min",
    day: "01",
    month: "MAIO",
    year: "2026",
  },
];

export default function Logs() {
  return (
    <AppShell activeTab="logs">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {logs.map((log) => (
          <article
            key={`${log.day}-${log.started}`}
            className="ds-card grid gap-6 p-5 md:grid-cols-[120px_1fr_100px] md:items-center"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="ds-label">Ciclos concluídos</p>
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-primary text-3xl font-bold text-foreground">
                {log.cycles}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="ds-label">Começou:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.started}
                  </p>
                </div>
                <div>
                  <p className="ds-label">Terminou:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.finished}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="ds-label">Tempo ativo:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.active}
                  </p>
                </div>
                <div>
                  <p className="ds-label">Tempo descanso:</p>
                  <p className="text-sm font-semibold text-foreground">
                    {log.rest}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold leading-none text-foreground">
                  {log.day}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                  {log.month}
                </p>
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                  {log.year}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
