import { Clock, Plus, X } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { TimerControls } from "@/components/foco/timer-controls";
import { TimerRing } from "@/components/foco/timer-ring";

const presets = [
  { focus: "25", break: "05" },
  { focus: "50", break: "10" },
  { focus: "100", break: "20" },
];

export default function Foco() {
  return (
    <AppShell activeTab="foco" contentClassName="mx-auto max-w-3xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-center">
        <aside className="hidden w-44 shrink-0 flex-col gap-3 lg:flex">
          {presets.map((preset) => (
            <div
              key={`${preset.focus}-${preset.break}`}
              className="flex items-center justify-between rounded-full border border-primary/50 bg-surface/50 px-4 py-2.5 text-sm text-foreground"
            >
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>
                  {preset.focus} | {preset.break}
                </span>
              </div>
              <X className="size-3.5 text-muted-foreground" />
            </div>
          ))}
          <button
            type="button"
            aria-label="Adicionar preset"
            className="flex size-10 items-center justify-center self-start rounded-full border border-primary/40 text-primary"
          >
            <Plus className="size-5" />
          </button>
        </aside>

        <div className="flex flex-1 flex-col items-center gap-10 py-4">
          <TimerRing time="22:47" progress={0.72} />
          <TimerControls />
        </div>
      </div>
    </AppShell>
  );
}
