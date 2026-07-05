import { z } from "zod";

export const createConfiguracaoSchema = z.object({
  nome: z.string().trim().min(2).max(80),
  duracaoFocoMin: z.number().int().min(1).max(180),
  duracaoPausaCurtaMin: z.number().int().min(1).max(60),
  duracaoPausaLongaMin: z.number().int().min(1).max(120),
  ciclosAtePausaLonga: z.number().int().min(1).max(12),
});

export const updateConfiguracaoSchema = createConfiguracaoSchema.partial();

export const createSessaoSchema = z.object({
  configuracaoId: z.string().min(1),
});

export const updateSessaoSchema = z.object({
  ciclosCompletos: z.number().int().min(0).optional(),
  faseAtual: z.enum(["FOCO", "PAUSA_CURTA", "PAUSA_LONGA"]).optional(),
  cicloAtual: z.number().int().min(1).optional(),
  fim: z.string().datetime().nullable().optional(),
  finalizada: z.boolean().optional(),
});
