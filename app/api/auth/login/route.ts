import { NextResponse } from "next/server";

import { createSessionCookie } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import { autenticarUsuario } from "@/lib/services/usuario.service";
import { loginUsuarioSchema } from "@/lib/validations/usuario";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginUsuarioSchema.parse(body);
    const usuario = await autenticarUsuario(data);

    await createSessionCookie(usuario);

    return NextResponse.json(usuario);
  } catch (error) {
    return handleRouteError(error);
  }
}
