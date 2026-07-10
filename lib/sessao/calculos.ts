import type { ConfiguracaoTimer } from "@/interfaces/Configuracao";
import type { SessaoEstudo } from "@/interfaces/Sessao";

export function formatHour(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

export function calcularTempos(
  sessao: Pick<SessaoEstudo, "ciclosCompletos" | "fim">,
  config?: Pick<
    ConfiguracaoTimer,
    "duracaoFocoMin" | "duracaoPausaCurtaMin" | "duracaoPausaLongaMin" | "ciclosAtePausaLonga"
  > | null,
) {
  if (sessao.ciclosCompletos === 0) {
    return { ativo: 0, descanso: 0 };
  }

  // Fallback caso o timer tenha sido apagado
  const safeConfig = config || {
    duracaoFocoMin: 25,
    duracaoPausaCurtaMin: 5,
    duracaoPausaLongaMin: 15,
    ciclosAtePausaLonga: 4,
  };

  const ativo = sessao.ciclosCompletos * safeConfig.duracaoFocoMin;
  const pausasCurtas = Math.max(0, sessao.ciclosCompletos - 1);
  const descanso =
    pausasCurtas * safeConfig.duracaoPausaCurtaMin +
    Math.floor(sessao.ciclosCompletos / safeConfig.ciclosAtePausaLonga) *
      safeConfig.duracaoPausaLongaMin;

  return { ativo, descanso };
}

export function calcularOfensiva(datas: string[]): number {
  if (datas.length === 0) return 0;

  const diasUnicos = [
    ...new Set(datas.map((d) => new Date(d).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 1;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const primeiro = new Date(diasUnicos[0]!);
  primeiro.setHours(0, 0, 0, 0);

  const diffHoje = (hoje.getTime() - primeiro.getTime()) / (1000 * 60 * 60 * 24);
  if (diffHoje > 1) return 0;

  for (let i = 1; i < diasUnicos.length; i++) {
    const atual = new Date(diasUnicos[i - 1]!);
    const anterior = new Date(diasUnicos[i]!);
    atual.setHours(0, 0, 0, 0);
    anterior.setHours(0, 0, 0, 0);

    const diff = (atual.getTime() - anterior.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
