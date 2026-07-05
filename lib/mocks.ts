import {
  Usuario,
  ConfiguracaoTimer,
  SessaoEstudo,
} from './types';

// Usuários simulados
export const mockUsuarios: Usuario[] = [
  {
    id: 'usr_1',
    nome: 'Luiz',
    email: 'luiz@example.com',
    criadoEm: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 'usr_2',
    nome: 'Maria',
    email: 'maria@example.com',
    criadoEm: new Date('2024-02-15T14:30:00Z'),
  },
];

// Configurações de Timer simuladas
export const mockConfiguracoes: ConfiguracaoTimer[] = [
  {
    id: 'cfg_classico',
    nome: 'Pomodoro Clássico',
    duracaoFocoMin: 25,
    duracaoPausaCurtaMin: 5,
    duracaoPausaLongaMin: 15,
    ciclosAtePausaLonga: 4,
    ehPreset: true,
    tipo: 'CLASSICO',
  },
  {
    id: 'cfg_custom_1',
    nome: 'Foco Intenso (50/10)',
    duracaoFocoMin: 50,
    duracaoPausaCurtaMin: 10,
    duracaoPausaLongaMin: 20,
    ciclosAtePausaLonga: 2,
    ehPreset: false,
    tipo: 'CUSTOMIZADO',
  },
];

// Sessões de Estudo simuladas
export const mockSessoesEstudo: SessaoEstudo[] = [
  {
    id: 'ses_1',
    usuarioId: 'usr_1',
    inicio: new Date('2026-05-03T09:30:00'),
    fim: new Date('2026-05-03T11:04:00'),
    ciclosCompletos: 3,
    configuracaoId: 'cfg_classico',
    estado: {
      faseAtual: 'PAUSA_LONGA',
      cicloAtual: 3,
      tempoRestanteSeg: 0,
      configuracaoId: 'cfg_classico',
    },
  },
  {
    id: 'ses_2',
    usuarioId: 'usr_1',
    inicio: new Date('2026-05-02T14:10:00'),
    fim: new Date('2026-05-02T18:45:00'),
    ciclosCompletos: 17,
    configuracaoId: 'cfg_custom_1',
    estado: {
      faseAtual: 'PAUSA_CURTA',
      cicloAtual: 17,
      tempoRestanteSeg: 0,
      configuracaoId: 'cfg_custom_1',
    },
  },
  {
    id: 'ses_3',
    usuarioId: 'usr_1',
    inicio: new Date('2026-05-01T08:00:00'),
    fim: new Date('2026-05-01T10:20:00'),
    ciclosCompletos: 8,
    configuracaoId: 'cfg_classico',
    estado: {
      faseAtual: 'PAUSA_CURTA',
      cicloAtual: 8,
      tempoRestanteSeg: 0,
      configuracaoId: 'cfg_classico',
    },
  },
];

// Funções utilitárias opcionais para buscar mocks
export function getUsuarioById(id: string): Usuario | undefined {
  return mockUsuarios.find((u) => u.id === id);
}

export function getConfiguracaoById(id: string): ConfiguracaoTimer | undefined {
  return mockConfiguracoes.find((c) => c.id === id);
}

export function getSessoesPorUsuario(usuarioId: string): SessaoEstudo[] {
  return mockSessoesEstudo.filter((s) => s.usuarioId === usuarioId);
}
