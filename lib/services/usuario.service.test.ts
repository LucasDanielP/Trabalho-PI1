import { beforeEach, describe, expect, it, vi } from "vitest";

import { hashSenha } from "@/lib/auth/password";
import { Prisma } from "@/lib/generated/prisma/client";

const prismaMock = vi.hoisted(() => ({
  usuario: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));

import {
  autenticarUsuario,
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  UsuarioServiceError,
} from "./usuario.service";

const usuarioDb = {
  id: "usr_1",
  nome: "Lucas",
  email: "lucas@email.com",
  senha: "",
  criadoEm: new Date("2026-01-01T10:00:00.000Z"),
};

describe("createUsuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria usuário e não expõe a senha na resposta", async () => {
    prismaMock.usuario.create.mockResolvedValue({
      ...usuarioDb,
      senha: "$2a$12$hash",
    });

    const result = await createUsuario({
      nome: "Lucas",
      email: "lucas@email.com",
      senha: "senha123",
    });

    expect(result).toEqual({
      id: "usr_1",
      nome: "Lucas",
      email: "lucas@email.com",
      criadoEm: "2026-01-01T10:00:00.000Z",
    });
    expect(result).not.toHaveProperty("senha");

    const createCall = prismaMock.usuario.create.mock.calls[0]?.[0];
    expect(createCall.data.senha).not.toBe("senha123");
    expect(createCall.data.senha).toMatch(/^\$2/);
  });
});

describe("autenticarUsuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("autentica com credenciais corretas", async () => {
    const senhaHash = await hashSenha("senha123");
    prismaMock.usuario.findUnique.mockResolvedValue({
      ...usuarioDb,
      senha: senhaHash,
    });

    const result = await autenticarUsuario({
      email: "lucas@email.com",
      senha: "senha123",
    });

    expect(result.email).toBe("lucas@email.com");
    expect(result).not.toHaveProperty("senha");
  });

  it("lança CREDENCIAIS_INVALIDAS quando usuário não existe", async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    await expect(
      autenticarUsuario({ email: "nao@existe.com", senha: "senha123" }),
    ).rejects.toMatchObject({
      code: "CREDENCIAIS_INVALIDAS",
    });
  });

  it("lança CREDENCIAIS_INVALIDAS quando senha está errada", async () => {
    const senhaHash = await hashSenha("senhaCorreta");
    prismaMock.usuario.findUnique.mockResolvedValue({
      ...usuarioDb,
      senha: senhaHash,
    });

    await expect(
      autenticarUsuario({ email: "lucas@email.com", senha: "senhaErrada" }),
    ).rejects.toBeInstanceOf(UsuarioServiceError);
  });
});

describe("getUsuarioById e deleteUsuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna null quando usuário não existe", async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);
    expect(await getUsuarioById("inexistente")).toBeNull();
  });

  it("lança NOT_FOUND ao excluir usuário inexistente", async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Registro não encontrado",
      {
        code: "P2025",
        clientVersion: "7.8.0",
      },
    );

    prismaMock.usuario.delete.mockRejectedValue(prismaError);

    await expect(deleteUsuario("inexistente")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
