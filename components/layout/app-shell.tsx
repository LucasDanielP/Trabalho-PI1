import { PanelLeft } from "lucide-react";

import { NavTabs, type NavTab } from "@/components/layout/nav-tabs";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  activeTab?: NavTab;
  showNav?: boolean;
  className?: string;
  contentClassName?: string;
};

export function AppShell({
  children,
  activeTab,
  showNav = true,
  className,
  contentClassName,
}: AppShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-full flex-1 items-center justify-center px-4 py-8 md:px-8 md:py-12",
        className,
      )}
    >
      <div className="ds-panel relative mx-auto w-full max-w-6xl p-6 md:p-10">
        <button
          type="button"
          aria-label="Alternar painel lateral"
          className="absolute left-6 top-6 text-accent-green md:left-10 md:top-10"
        >
          <PanelLeft className="size-5" strokeWidth={2.25} />
        </button>

        {showNav && activeTab ? (
          <div className="mb-8 flex justify-center pt-2 md:mb-10">
            <NavTabs active={activeTab} />
          </div>
        ) : null}

        <div className={cn("relative", contentClassName)}>{children}</div>
      </div>
    </main>
  );
}
