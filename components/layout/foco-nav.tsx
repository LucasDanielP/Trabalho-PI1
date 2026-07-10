"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, LogOut } from "lucide-react";

import { useTimerConfig } from "@/components/providers/timer-config-provider";
import { ConfigSidebar } from "@/components/foco/config-sidebar";

type FocoNavProps = {
  activeTab: "foco" | "dados" | "logs";
};

export function FocoNav({ activeTab }: FocoNavProps) {
  const { sidebarAberta, setSidebarAberta, usuarioLogado } = useTimerConfig();

  return (
    <>
      <div className="relative z-20 mb-8 flex items-center justify-between">
        <button
          type="button"
          aria-label="Abrir configurações de timer"
          onClick={() => setSidebarAberta(true)}
          className={`text-[#04D939] transition-all hover:brightness-110 ${sidebarAberta ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Sidebar size={24} strokeWidth={2} />
        </button>

        <div className="absolute left-1/2 flex -translate-x-1/2 gap-4">
          <Link
            href="/timer"
            className={
              activeTab === "foco"
                ? "rounded-full bg-[#04D939] px-8 py-2 text-sm font-bold text-[#012340]"
                : "rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
            }
          >
            Foco
          </Link>
          <Link
            href="/dados"
            className={
              activeTab === "dados"
                ? "rounded-full bg-[#04D939] px-8 py-2 text-sm font-bold text-[#012340]"
                : "rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
            }
          >
            Dados
          </Link>
          <Link
            href="/logs"
            className={
              activeTab === "logs"
                ? "rounded-full bg-[#04D939] px-8 py-2 text-sm font-bold text-[#012340]"
                : "rounded-full bg-[#112031] px-8 py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
            }
          >
            Logs
          </Link>
        </div>

        {usuarioLogado ? (
          <button
            type="button"
            aria-label="Sair da conta"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
            className="flex items-center gap-2 rounded-full border border-[#BC2F32]/50 bg-[#BC2F32]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#ff8a8a] transition-all hover:bg-[#BC2F32] hover:text-white shadow-sm"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </>
  );
}

export function FocoLayout({
  activeTab,
  children,
}: {
  activeTab: "foco" | "dados" | "logs";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex min-h-[500px] flex-col">
      <FocoNav activeTab={activeTab} />
      {children}
    </div>
  );
}
