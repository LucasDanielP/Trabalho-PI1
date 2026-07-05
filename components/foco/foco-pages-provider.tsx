"use client";

import { TimerConfigProvider } from "@/components/providers/timer-config-provider";

export function FocoPagesProvider({ children }: { children: React.ReactNode }) {
  return <TimerConfigProvider>{children}</TimerConfigProvider>;
}
