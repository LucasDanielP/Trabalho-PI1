import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <AppShell showNav={false} contentClassName="flex min-h-[420px] flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-3">
        <p className="ds-label text-primary">Work &amp; Rest</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Seja bem-vindo!
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground md:text-base">
          Organize seus ciclos de foco e descanso com a técnica Pomodoro.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/sign" className={cn(buttonVariants({ size: "lg" }))}>
          Criar minha conta
        </Link>
        <Link
          href="/dados"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Começar sem conta
        </Link>
      </div>
    </AppShell>
  );
}
