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
    inicio: new Date('2024-03-01T09:00:00Z'),
    fim: new Date('2024-03-01T11:00:00Z'), // 2 horas (4 ciclos de 25m + pausas)
    ciclosCompletos: 4,
    configuracaoId: 'cfg_classico',
    estado: {
      faseAtual: 'PAUSA_LONGA',
      cicloAtual: 4,
      tempoRestanteSeg: 900, // 15 minutos em segundos
      configuracaoId: 'cfg_classico',
    },
  },
  {
    id: 'ses_2',
    usuarioId: 'usr_1',
    inicio: new Date('2024-03-02T14:00:00Z'),
    fim: new Date('2024-03-02T15:00:00Z'), // 1 hora (1 ciclo de 50m + pausa)
    ciclosCompletos: 1,
    configuracaoId: 'cfg_custom_1',
    estado: {
      faseAtual: 'PAUSA_CURTA',
      cicloAtual: 1,
      tempoRestanteSeg: 600, // 10 minutos em segundos
      configuracaoId: 'cfg_custom_1',
    },
  },
  {
    id: 'ses_3',
    usuarioId: 'usr_1',
    inicio: new Date('2024-03-03T10:00:00Z'), // Data estática para evitar erro de hidratação (hydration mismatch)
    fim: null, // Em andamento
    ciclosCompletos: 0,
    configuracaoId: 'cfg_classico',
    estado: {
      faseAtual: 'FOCO',
      cicloAtual: 1,
      tempoRestanteSeg: 1500, // 25 minutos em segundos
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
