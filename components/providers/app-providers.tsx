"use client";

import { TimerConfigProvider } from "./timer-config-provider";
import { TimerStateProvider } from "./timer-state-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TimerConfigProvider>
      <TimerStateProvider>
        {children}
      </TimerStateProvider>
    </TimerConfigProvider>
  );
}
