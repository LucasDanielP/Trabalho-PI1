import type { SessaoEstudo } from "@/interfaces/Sessao";

const STORAGE_KEY = "work-and-rest-guest-sessions";

export function getGuestSessoes(): SessaoEstudo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessaoEstudo[]) : [];
  } catch {
    return [];
  }
}

export function saveGuestSessao(sessao: SessaoEstudo) {
  const sessoes = getGuestSessoes();
  const index = sessoes.findIndex((s) => s.id === sessao.id);
  if (index >= 0) {
    sessoes[index] = sessao;
  } else {
    sessoes.unshift(sessao);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessoes));
}

export function createGuestSessao(
  configuracaoId: string,
  config: SessaoEstudo["configuracao"],
): SessaoEstudo {
  return {
    id: `guest_${Date.now()}`,
    usuarioId: "guest",
    configuracaoId,
    inicio: new Date().toISOString(),
    fim: null,
    ciclosCompletos: 0,
    faseAtual: "FOCO",
    cicloAtual: 1,
    finalizada: false,
    configuracao: config,
  };
}
