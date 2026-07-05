import { NextResponse } from "next/server";
import { getSessionUsuario } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getSessionUsuario();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;

    const sessoes = await prisma.sessaoEstudo.findMany({
      where: { usuarioId: session.id },
      orderBy: { inicio: 'desc' },
      take: limit,
      include: {
        configuracao: true
      }
    });

    return NextResponse.json(sessoes);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar sessões" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUsuario();
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      configuracaoId,
      inicio,
      fim,
      ciclosCompletos,
    } = body;

    const novaSessao = await prisma.sessaoEstudo.create({
      data: {
        usuarioId: session.id,
        configuracaoId,
        inicio: new Date(inicio),
        fim: fim ? new Date(fim) : undefined,
        ciclosCompletos,
      },
    });

    return NextResponse.json(novaSessao, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao registrar sessão" },
      { status: 500 }
    );
  }
}
