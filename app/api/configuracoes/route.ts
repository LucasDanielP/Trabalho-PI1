import { NextResponse } from "next/server";
import { getSessionUsuario } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSessionUsuario();
    const usuarioId = session?.id;

    // Buscar presets (configurações globais) e as customizadas do usuário atual
    let configuracoes = await prisma.configuracaoTimer.findMany({
      where: {
        OR: [
          { ehPreset: true },
          usuarioId ? { usuarioId } : {},
        ],
      },
      orderBy: { criadoEm: 'asc' },
    });

    if (configuracoes.length === 0) {
      // Cria um preset padrão se o banco estiver completamente vazio
      const presetPadrao = await prisma.configuracaoTimer.create({
        data: {
          nome: "Pomodoro Padrão",
          duracaoFocoMin: 25,
          duracaoPausaCurtaMin: 5,
          duracaoPausaLongaMin: 15,
          ciclosAtePausaLonga: 4,
          ehPreset: true,
          tipo: "CLASSICO"
        }
      });
      configuracoes = [presetPadrao];
    }

    return NextResponse.json(configuracoes);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
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
      nome,
      duracaoFocoMin,
      duracaoPausaCurtaMin,
      duracaoPausaLongaMin,
      ciclosAtePausaLonga,
    } = body;

    const novaConfig = await prisma.configuracaoTimer.create({
      data: {
        nome,
        duracaoFocoMin,
        duracaoPausaCurtaMin,
        duracaoPausaLongaMin,
        ciclosAtePausaLonga,
        usuarioId: session.id,
        ehPreset: false,
        tipo: "CUSTOMIZADO",
      },
    });

    return NextResponse.json(novaConfig, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar configuração" },
      { status: 500 }
    );
  }
}
