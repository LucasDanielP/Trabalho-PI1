import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import {
  deleteConfiguracao,
  getConfiguracaoById,
  updateConfiguracao,
} from "@/lib/services/configuracao.service";
import { updateConfiguracaoSchema } from "@/lib/validations/timer";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const configuracao = await getConfiguracaoById(id);

    if (!configuracao) {
      return NextResponse.json(
        { error: "Configuração não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(configuracao);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const data = updateConfiguracaoSchema.parse(body);
    const configuracao = await updateConfiguracao(id, session.id, data);

    return NextResponse.json(configuracao);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await context.params;
    await deleteConfiguracao(id, session.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
