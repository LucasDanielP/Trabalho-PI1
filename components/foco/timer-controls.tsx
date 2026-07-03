import { Pause, RotateCcw, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TimerControls() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button variant="outline" size="icon-lg" aria-label="Reiniciar">
        <RotateCcw />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="min-w-40 gap-2 uppercase tracking-wide"
      >
        <Pause className="size-4" />
        Pausar
      </Button>

      <Button variant="outline" size="icon-lg" aria-label="Pular fase">
        <SkipForward />
      </Button>
    </div>
  );
}
