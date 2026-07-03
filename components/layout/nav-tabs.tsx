import Link from "next/link";

import { cn } from "@/lib/utils";

export type NavTab = "foco" | "dados" | "logs";

const tabs: { id: NavTab; label: string; href: string }[] = [
  { id: "foco", label: "Foco", href: "/foco" },
  { id: "dados", label: "Dados", href: "/dados" },
  { id: "logs", label: "Logs", href: "/logs" },
];

type NavTabsProps = {
  active: NavTab;
};

export function NavTabs({ active }: NavTabsProps) {
  return (
    <nav className="flex gap-2 rounded-full bg-secondary/70 p-1.5">
      {tabs.map((tab) => {
        const isActive = tab.id === active;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
