export type Usuario = {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
};

export type CreateUsuarioInput = {
  nome: string;
  email: string;
  senha: string;
};

export type UpdateUsuarioInput = {
  nome?: string;
  email?: string;
};

export type LoginUsuarioInput = {
  email: string;
  senha: string;
};

export type UsuarioDTO = Usuario;
