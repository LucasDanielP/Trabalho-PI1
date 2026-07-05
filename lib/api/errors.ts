import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UsuarioServiceError } from "@/lib/services/usuario.service";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(", ");
    return jsonError(message, 400);
  }

  if (error instanceof UsuarioServiceError) {
    if (error.code === "NOT_FOUND") {
      return jsonError(error.message, 404);
    }

    if (error.code === "EMAIL_EM_USO") {
      return jsonError(error.message, 409);
    }

    if (error.code === "CREDENCIAIS_INVALIDAS") {
      return jsonError(error.message, 401);
    }

    return jsonError(error.message, 400);
  }

  if (error instanceof Error) {
    if (error.name === "ConfiguracaoServiceError") {
      const serviceError = error as { code?: string; message: string };
      if (serviceError.code === "NOT_FOUND") return jsonError(error.message, 404);
      if (serviceError.code === "FORBIDDEN") return jsonError(error.message, 403);
      if (serviceError.code === "PRESET_READONLY") return jsonError(error.message, 403);
    }

    if (error.name === "SessaoServiceError") {
      const serviceError = error as { code?: string; message: string };
      if (serviceError.code === "NOT_FOUND") return jsonError(error.message, 404);
      if (serviceError.code === "FORBIDDEN") return jsonError(error.message, 403);
    }
  }

  console.error(error);
  return jsonError("Erro interno do servidor", 500);
}
