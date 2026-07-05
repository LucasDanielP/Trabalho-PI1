import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";
import { calcularTempos, calcularOfensiva } from "@/lib/sessao/calculos";
import type {
  CreateSessaoInput,
  ResumoDados,
  SessaoEstudo,
  UpdateSessaoInput,
} from "@/interfaces/Sessao";

function serializeSessao(sessao: {
  id: string;
  usuarioId: string;
  configuracaoId: string;
  inicio: Date;
  fim: Date | null;
  ciclosCompletos: number;
  faseAtual: "FOCO" | "PAUSA_CURTA" | "PAUSA_LONGA";
  cicloAtual: number;
  finalizada: boolean;
  configuracao?: {
    id: string;
    nome: string;
    duracaoFocoMin: number;
    duracaoPausaCurtaMin: number;
    duracaoPausaLongaMin: number;
    ciclosAtePausaLonga: number;
  };
}): SessaoEstudo {
  return {
    id: sessao.id,
    usuarioId: sessao.usuarioId,
    configuracaoId: sessao.configuracaoId,
    inicio: sessao.inicio.toISOString(),
    fim: sessao.fim?.toISOString() ?? null,
    ciclosCompletos: sessao.ciclosCompletos,
    faseAtual: sessao.faseAtual,
    cicloAtual: sessao.cicloAtual,
    finalizada: sessao.finalizada,
    configuracao: sessao.configuracao,
  };
}

export class SessaoServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "FORBIDDEN",
  ) {
    super(message);
    this.name = "SessaoServiceError";
  }
}

export async function listSessoes(usuarioId: string): Promise<SessaoEstudo[]> {
  const sessoes = await prisma.sessaoEstudo.findMany({
    where: { usuarioId },
    include: {
      configuracao: {
        select: {
          id: true,
          nome: true,
          duracaoFocoMin: true,
          duracaoPausaCurtaMin: true,
          duracaoPausaLongaMin: true,
          ciclosAtePausaLonga: true,
        },
      },
    },
    orderBy: { inicio: "desc" },
  });

  return sessoes.map(serializeSessao);
}

export async function createSessao(
  usuarioId: string,
  input: CreateSessaoInput,
): Promise<SessaoEstudo> {
  const sessao = await prisma.sessaoEstudo.create({
    data: {
      usuarioId,
      configuracaoId: input.configuracaoId,
    },
    include: {
      configuracao: {
        select: {
          id: true,
          nome: true,
          duracaoFocoMin: true,
          duracaoPausaCurtaMin: true,
          duracaoPausaLongaMin: true,
          ciclosAtePausaLonga: true,
        },
      },
    },
  });

  return serializeSessao(sessao);
}

export async function updateSessao(
  id: string,
  usuarioId: string,
  input: UpdateSessaoInput,
): Promise<SessaoEstudo> {
  const existing = await prisma.sessaoEstudo.findUnique({ where: { id } });

  if (!existing) {
    throw new SessaoServiceError("Sessão não encontrada", "NOT_FOUND");
  }

  if (existing.usuarioId !== usuarioId) {
    throw new SessaoServiceError("Acesso negado", "FORBIDDEN");
  }

  const sessao = await prisma.sessaoEstudo.update({
    where: { id },
    data: {
      ...input,
      fim: input.fim === null ? null : input.fim ? new Date(input.fim) : undefined,
    },
    include: {
      configuracao: {
        select: {
          id: true,
          nome: true,
          duracaoFocoMin: true,
          duracaoPausaCurtaMin: true,
          duracaoPausaLongaMin: true,
          ciclosAtePausaLonga: true,
        },
      },
    },
  });

  return serializeSessao(sessao);
}

export async function getResumoDados(
  usuarioId: string,
  periodo: "Semana" | "Mês" | "Ano" = "Semana",
): Promise<ResumoDados> {
  const sessoes = await listSessoes(usuarioId);
  const finalizadas = sessoes.filter((s) => s.ciclosCompletos > 0);

  const agora = new Date();
  const inicioPeriodo = new Date(agora);

  if (periodo === "Semana") {
    inicioPeriodo.setDate(agora.getDate() - 6);
  } else if (periodo === "Mês") {
    inicioPeriodo.setDate(agora.getDate() - 29);
  } else {
    inicioPeriodo.setFullYear(agora.getFullYear() - 1);
  }

  inicioPeriodo.setHours(0, 0, 0, 0);

  const noPeriodo = finalizadas.filter(
    (s) => new Date(s.inicio) >= inicioPeriodo,
  );

  let totalMinutosFoco = 0;
  let totalCiclos = 0;
  let hojeMinutosFoco = 0;
  let hojeCiclos = 0;
  let hojeMinutosDescanso = 0;

  const hojeStr = agora.toDateString();
  const porDia = new Map<string, { ciclos: number; minutos: number }>();

  for (const sessao of finalizadas) {
    const config = sessao.configuracao;
    if (!config) continue;

    const { ativo, descanso } = calcularTempos(sessao, config);
    totalMinutosFoco += ativo;
    totalCiclos += sessao.ciclosCompletos;

    const dia = new Date(sessao.inicio).toDateString();
    const atual = porDia.get(dia) ?? { ciclos: 0, minutos: 0 };
    atual.ciclos += sessao.ciclosCompletos;
    atual.minutos += ativo;
    porDia.set(dia, atual);

    if (dia === hojeStr) {
      hojeMinutosFoco += ativo;
      hojeCiclos += sessao.ciclosCompletos;
      hojeMinutosDescanso += descanso;
    }
  }

  const dias = [...porDia.keys()].sort();
  const pontos = dias
    .filter((d) => new Date(d) >= inicioPeriodo)
    .map((d) => ({
      data: new Date(d).toISOString(),
      ciclos: porDia.get(d)!.ciclos,
      minutosEstudados: porDia.get(d)!.minutos,
    }));

  return {
    ofensivaDias: calcularOfensiva(finalizadas.map((s) => s.inicio)),
    totalMinutosFoco,
    totalCiclos,
    hojeMinutosFoco,
    hojeCiclos,
    hojeMinutosDescanso,
    graficoMinutos: pontos,
    graficoCiclos: pontos.map((p) => ({
      data: p.data,
      ciclos: p.ciclos,
      minutosEstudados: p.minutosEstudados,
    })),
  };
}
