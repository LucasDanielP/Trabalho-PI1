import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import {
  createConfiguracao,
  listConfiguracoes,
  seedPresetsIfEmpty,
} from "@/lib/services/configuracao.service";
import { createConfiguracaoSchema } from "@/lib/validations/timer";

export async function GET() {
  try {
    await seedPresetsIfEmpty();
    const session = await getSessionUsuario();
    const configuracoes = await listConfiguracoes(session?.id);

    return NextResponse.json(configuracoes);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json(
        { error: "Faça login para criar configurações personalizadas" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = createConfiguracaoSchema.parse(body);
    const configuracao = await createConfiguracao(session.id, data);

    return NextResponse.json(configuracao, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
