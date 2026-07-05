import { prisma } from "@/lib/db";
import type {
  ConfiguracaoTimer,
  CreateConfiguracaoInput,
  UpdateConfiguracaoInput,
} from "@/interfaces/Configuracao";

function serializeConfiguracao(config: {
  id: string;
  nome: string;
  duracaoFocoMin: number;
  duracaoPausaCurtaMin: number;
  duracaoPausaLongaMin: number;
  ciclosAtePausaLonga: number;
  ehPreset: boolean;
  tipo: "CLASSICO" | "CUSTOMIZADO";
  usuarioId: string | null;
  criadoEm: Date;
}): ConfiguracaoTimer {
  return {
    id: config.id,
    nome: config.nome,
    duracaoFocoMin: config.duracaoFocoMin,
    duracaoPausaCurtaMin: config.duracaoPausaCurtaMin,
    duracaoPausaLongaMin: config.duracaoPausaLongaMin,
    ciclosAtePausaLonga: config.ciclosAtePausaLonga,
    ehPreset: config.ehPreset,
    tipo: config.tipo,
    usuarioId: config.usuarioId,
    criadoEm: config.criadoEm.toISOString(),
  };
}

export class ConfiguracaoServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "FORBIDDEN" | "PRESET_READONLY",
  ) {
    super(message);
    this.name = "ConfiguracaoServiceError";
  }
}

export async function listConfiguracoes(
  usuarioId?: string | null,
): Promise<ConfiguracaoTimer[]> {
  const configs = await prisma.configuracaoTimer.findMany({
    where: {
      OR: [{ ehPreset: true }, ...(usuarioId ? [{ usuarioId }] : [])],
    },
    orderBy: [{ ehPreset: "desc" }, { criadoEm: "asc" }],
  });

  return configs.map(serializeConfiguracao);
}

export async function getConfiguracaoById(
  id: string,
): Promise<ConfiguracaoTimer | null> {
  const config = await prisma.configuracaoTimer.findUnique({ where: { id } });
  return config ? serializeConfiguracao(config) : null;
}

export async function createConfiguracao(
  usuarioId: string,
  input: CreateConfiguracaoInput,
): Promise<ConfiguracaoTimer> {
  const config = await prisma.configuracaoTimer.create({
    data: {
      ...input,
      ehPreset: false,
      tipo: "CUSTOMIZADO",
      usuarioId,
    },
  });

  return serializeConfiguracao(config);
}

export async function updateConfiguracao(
  id: string,
  usuarioId: string,
  input: UpdateConfiguracaoInput,
): Promise<ConfiguracaoTimer> {
  const existing = await prisma.configuracaoTimer.findUnique({ where: { id } });

  if (!existing) {
    throw new ConfiguracaoServiceError("Configuração não encontrada", "NOT_FOUND");
  }

  if (existing.ehPreset) {
    throw new ConfiguracaoServiceError(
      "Presets não podem ser editados",
      "PRESET_READONLY",
    );
  }

  if (existing.usuarioId !== usuarioId) {
    throw new ConfiguracaoServiceError("Acesso negado", "FORBIDDEN");
  }

  const config = await prisma.configuracaoTimer.update({
    where: { id },
    data: input,
  });

  return serializeConfiguracao(config);
}

export async function deleteConfiguracao(
  id: string,
  usuarioId: string,
): Promise<void> {
  const existing = await prisma.configuracaoTimer.findUnique({ where: { id } });

  if (!existing) {
    throw new ConfiguracaoServiceError("Configuração não encontrada", "NOT_FOUND");
  }

  if (existing.ehPreset) {
    throw new ConfiguracaoServiceError(
      "Presets não podem ser excluídos",
      "PRESET_READONLY",
    );
  }

  if (existing.usuarioId !== usuarioId) {
    throw new ConfiguracaoServiceError("Acesso negado", "FORBIDDEN");
  }

  await prisma.configuracaoTimer.delete({ where: { id } });
}

export async function seedPresetsIfEmpty() {
  const count = await prisma.configuracaoTimer.count({ where: { ehPreset: true } });
  if (count > 0) return;

  await prisma.configuracaoTimer.createMany({
    data: [
      {
        nome: "Pomodoro Clássico",
        duracaoFocoMin: 25,
        duracaoPausaCurtaMin: 5,
        duracaoPausaLongaMin: 15,
        ciclosAtePausaLonga: 4,
        ehPreset: true,
        tipo: "CLASSICO",
      },
      {
        nome: "Foco Intenso (50/10)",
        duracaoFocoMin: 50,
        duracaoPausaCurtaMin: 10,
        duracaoPausaLongaMin: 20,
        ciclosAtePausaLonga: 2,
        ehPreset: true,
        tipo: "CLASSICO",
      },
    ],
  });
}
