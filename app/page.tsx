import Link from "next/link";
<<<<<<< HEAD

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
=======
import { Play } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-white tracking-widest mb-2">work & rest</h1>
      <h2 className="text-[#04D939] text-lg font-medium mb-12">Seja bem-vindo!</h2>
      
      <div className="flex flex-col gap-5 w-full">
        
        {/* Botão Primário (Preenchido) Clean */}
        <Link 
          href="/cadastro" 
          className="w-full rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center bg-[#04D939] text-[#012340] hover:brightness-110"
        >
          CRIAR MINHA CONTA
        </Link>
        
        {/* Botão Secundário (Outline) estilo botão Play */}
        <Link 
          href="/timer"
          className="w-full border border-[#04D939] text-[#04D939] bg-[#04D939]/5 hover:bg-[#04D939] hover:text-[#012340] rounded-full py-4 font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Play size={18} fill="currentColor" />
          COMEÇAR SEM CONTA
        </Link>


      </div>
    </div>
>>>>>>> 11bfee9ce0c3972a795615aa77e6e82e31bb7a7a
  );
}
