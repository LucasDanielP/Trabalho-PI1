import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("@/lib/db", () => ({ prisma: {} }));

import { handleRouteError } from "./errors";
import { UsuarioServiceError } from "@/lib/services/usuario.service";

describe("handleRouteError", () => {
  it("retorna 400 para erro de validação Zod", async () => {
    const schema = z.object({ nome: z.string().min(2) });
    const parsed = schema.safeParse({ nome: "A" });

    if (parsed.success) {
      throw new Error("Esperava falha de validação");
    }

    const response = handleRouteError(parsed.error);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBeTruthy();
  });

  it("retorna 401 para credenciais inválidas", async () => {
    const response = handleRouteError(
      new UsuarioServiceError("E-mail ou senha inválidos", "CREDENCIAIS_INVALIDAS"),
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("E-mail ou senha inválidos");
  });

  it("retorna 404 para usuário não encontrado", async () => {
    const response = handleRouteError(
      new UsuarioServiceError("Usuário não encontrado", "NOT_FOUND"),
    );

    expect(response.status).toBe(404);
  });

  it("retorna 409 para e-mail em uso", async () => {
    const response = handleRouteError(
      new UsuarioServiceError("Este e-mail já está cadastrado", "EMAIL_EM_USO"),
    );

    expect(response.status).toBe(409);
  });

  it("retorna 500 para erro inesperado", async () => {
    const response = handleRouteError(new Error("falha interna"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Erro interno do servidor");
  });
});
