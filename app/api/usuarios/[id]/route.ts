import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api/errors";
import {
  deleteUsuario,
  getUsuarioById,
  updateUsuario,
} from "@/lib/services/usuario.service";
import { updateUsuarioSchema } from "@/lib/validations/usuario";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const usuario = await getUsuarioById(id);

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = updateUsuarioSchema.parse(body);
    const usuario = await updateUsuario(id, data);

    return NextResponse.json(usuario);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteUsuario(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
