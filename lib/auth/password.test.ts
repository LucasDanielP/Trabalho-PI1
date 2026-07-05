import { describe, expect, it } from "vitest";

import { compararSenha, hashSenha } from "./password";

describe("hashSenha e compararSenha", () => {
  it("gera hash diferente da senha original", async () => {
    const senha = "minhaSenhaSegura";
    const hash = await hashSenha(senha);

    expect(hash).not.toBe(senha);
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("valida senha correta", async () => {
    const senha = "senha123";
    const hash = await hashSenha(senha);

    expect(await compararSenha(senha, hash)).toBe(true);
  });

  it("rejeita senha incorreta", async () => {
    const hash = await hashSenha("senhaCorreta");

    expect(await compararSenha("senhaErrada", hash)).toBe(false);
  });
});
