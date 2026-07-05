import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

export async function compararSenha(
  senha: string,
  senhaHash: string,
): Promise<boolean> {
  return bcrypt.compare(senha, senhaHash);
}
