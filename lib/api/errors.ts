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

    return jsonError(error.message, 400);
  }

  console.error(error);
  return jsonError("Erro interno do servidor", 500);
}
