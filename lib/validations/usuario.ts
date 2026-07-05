import { z } from "zod";

const senhaSchema = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");

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
  senha: senhaSchema,
});

export const loginUsuarioSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido"),
  senha: z.string().min(1, "Informe sua senha"),
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
export type LoginUsuarioSchema = z.infer<typeof loginUsuarioSchema>;
export type UpdateUsuarioSchema = z.infer<typeof updateUsuarioSchema>;
