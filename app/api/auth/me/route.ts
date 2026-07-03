import { NextResponse } from "next/server";

import { getSessionUsuario } from "@/lib/auth/session";
import { getUsuarioById } from "@/lib/services/usuario.service";

export async function GET() {
  const session = await getSessionUsuario();

  if (!session) {
    return NextResponse.json({ usuario: null });
  }

  const usuario = await getUsuarioById(session.id);

  if (!usuario) {
    return NextResponse.json({ usuario: null });
  }

  return NextResponse.json({ usuario });
}
