import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import type { Usuario } from "@/interfaces/User";

const SESSION_COOKIE = "work-and-rest-session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  nome: string;
  email: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET não está configurado no ambiente");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionCookie(usuario: Usuario) {
  const token = await new SignJWT({
    nome: usuario.nome,
    email: usuario.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(usuario.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUsuario(): Promise<Usuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const id = payload.sub;
    const nome = payload.nome;
    const email = payload.email;

    if (
      typeof id !== "string" ||
      typeof nome !== "string" ||
      typeof email !== "string"
    ) {
      return null;
    }

    return {
      id,
      nome,
      email,
      criadoEm: "",
    };
  } catch {
    return null;
  }
}
