import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import { createSessao, listSessoes } from "@/lib/services/sessao.service";
import { createSessaoSchema } from "@/lib/validations/timer";

export async function GET() {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json([]);
    }

    const sessoes = await listSessoes(session.id);
    return NextResponse.json(sessoes);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json(
        { error: "Faça login para salvar sessões no histórico" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = createSessaoSchema.parse(body);
    const sessao = await createSessao(session.id, data);

    return NextResponse.json(sessao, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
