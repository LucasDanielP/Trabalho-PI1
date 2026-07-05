import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { handleRouteError } from "@/lib/api/errors";
import { getResumoDados } from "@/lib/services/sessao.service";

export async function GET(request: Request) {
  try {
    const session = await getSessionUsuario();

    if (!session) {
      return NextResponse.json({
        ofensivaDias: 0,
        totalMinutosFoco: 0,
        totalCiclos: 0,
        hojeMinutosFoco: 0,
        hojeCiclos: 0,
        hojeMinutosDescanso: 0,
        graficoMinutos: [],
        graficoCiclos: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const periodo = (searchParams.get("periodo") ?? "Semana") as
      | "Semana"
      | "Mês"
      | "Ano";

    const resumo = await getResumoDados(session.id, periodo);
    return NextResponse.json(resumo);
  } catch (error) {
    return handleRouteError(error);
  }
}
