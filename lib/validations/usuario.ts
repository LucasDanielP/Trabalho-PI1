import { z } from "zod";

export const createUsuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido"),
});

export const updateUsuarioSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Informe um e-mail válido")
      .optional(),
  })
  .refine((data) => data.nome !== undefined || data.email !== undefined, {
    message: "Informe ao menos um campo para atualizar",
  });

export type CreateUsuarioSchema = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioSchema = z.infer<typeof updateUsuarioSchema>;
