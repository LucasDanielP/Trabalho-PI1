export type Usuario = {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
};

export type CreateUsuarioInput = {
  nome: string;
  email: string;
};

export type UpdateUsuarioInput = {
  nome?: string;
  email?: string;
};

export type UsuarioDTO = Usuario;
