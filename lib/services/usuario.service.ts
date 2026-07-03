import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";
import type {
  CreateUsuarioInput,
  UpdateUsuarioInput,
  Usuario,
} from "@/interfaces/User";

function serializeUsuario(usuario: {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
}): Usuario {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    criadoEm: usuario.criadoEm.toISOString(),
  };
}

export class UsuarioServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "EMAIL_EM_USO" | "VALIDATION",
  ) {
    super(message);
    this.name = "UsuarioServiceError";
  }
}

function handlePrismaError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new UsuarioServiceError(
      "Este e-mail já está cadastrado",
      "EMAIL_EM_USO",
    );
  }

  throw error;
}

export async function listUsuarios(): Promise<Usuario[]> {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
  });

  return usuarios.map(serializeUsuario);
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  return usuario ? serializeUsuario(usuario) : null;
}

export async function createUsuario(
  input: CreateUsuarioInput,
): Promise<Usuario> {
  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome: input.nome,
        email: input.email,
      },
    });

    return serializeUsuario(usuario);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateUsuario(
  id: string,
  input: UpdateUsuarioInput,
): Promise<Usuario> {
  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: input,
    });

    return serializeUsuario(usuario);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new UsuarioServiceError("Usuário não encontrado", "NOT_FOUND");
    }

    handlePrismaError(error);
  }
}

export async function deleteUsuario(id: string): Promise<void> {
  try {
    await prisma.usuario.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new UsuarioServiceError("Usuário não encontrado", "NOT_FOUND");
    }

    throw error;
  }
}
