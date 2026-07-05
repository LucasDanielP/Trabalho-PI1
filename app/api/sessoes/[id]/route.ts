import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import { updateSessao } from "@/lib/services/sessao.service";
import { updateSessaoSchema } from "@/lib/validations/timer";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const data = updateSessaoSchema.parse(body);
    const sessao = await updateSessao(id, session.id, data);

    return NextResponse.json(sessao);
  } catch (error) {
    return handleRouteError(error);
  }
}
