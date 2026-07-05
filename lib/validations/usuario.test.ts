import { describe, expect, it } from "vitest";

import {
  createUsuarioSchema,
  loginUsuarioSchema,
  updateUsuarioSchema,
} from "./usuario";

describe("createUsuarioSchema", () => {
  it("aceita dados válidos e normaliza o e-mail", () => {
    const result = createUsuarioSchema.safeParse({
      nome: "  Lucas  ",
      email: "  Lucas@Email.COM ",
      senha: "senha123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nome).toBe("Lucas");
      expect(result.data.email).toBe("lucas@email.com");
    }
  });

  it("rejeita nome muito curto", () => {
    const result = createUsuarioSchema.safeParse({
      nome: "A",
      email: "teste@email.com",
      senha: "senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha com menos de 6 caracteres", () => {
    const result = createUsuarioSchema.safeParse({
      nome: "Lucas",
      email: "teste@email.com",
      senha: "12345",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("6 caracteres");
    }
  });

  it("rejeita e-mail inválido", () => {
    const result = createUsuarioSchema.safeParse({
      nome: "Lucas",
      email: "email-invalido",
      senha: "senha123",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginUsuarioSchema", () => {
  it("aceita credenciais válidas", () => {
    const result = loginUsuarioSchema.safeParse({
      email: "usuario@email.com",
      senha: "qualquer",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita senha vazia", () => {
    const result = loginUsuarioSchema.safeParse({
      email: "usuario@email.com",
      senha: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("updateUsuarioSchema", () => {
  it("aceita atualização parcial de nome", () => {
    const result = updateUsuarioSchema.safeParse({ nome: "Novo Nome" });
    expect(result.success).toBe(true);
  });

  it("rejeita body vazio", () => {
    const result = updateUsuarioSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
