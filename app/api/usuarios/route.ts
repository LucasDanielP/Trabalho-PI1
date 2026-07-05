import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api/errors";
import {
  createUsuario,
  listUsuarios,
} from "@/lib/services/usuario.service";
import { createUsuarioSchema } from "@/lib/validations/usuario";

export async function GET() {
  try {
    const usuarios = await listUsuarios();
    return NextResponse.json(usuarios);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createUsuarioSchema.parse(body);
    const usuario = await createUsuario(data);

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
