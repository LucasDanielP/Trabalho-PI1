-- CreateEnum
CREATE TYPE "PresetTimer" AS ENUM ('CLASSICO', 'CUSTOMIZADO');

-- CreateEnum
CREATE TYPE "FaseTimer" AS ENUM ('FOCO', 'PAUSA_CURTA', 'PAUSA_LONGA');

-- CreateTable
CREATE TABLE "configuracoes_timer" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "duracaoFocoMin" INTEGER NOT NULL,
    "duracaoPausaCurtaMin" INTEGER NOT NULL,
    "duracaoPausaLongaMin" INTEGER NOT NULL,
    "ciclosAtePausaLonga" INTEGER NOT NULL,
    "ehPreset" BOOLEAN NOT NULL DEFAULT false,
    "tipo" "PresetTimer" NOT NULL DEFAULT 'CUSTOMIZADO',
    "usuarioId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracoes_timer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes_estudo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "configuracaoId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fim" TIMESTAMP(3),
    "ciclosCompletos" INTEGER NOT NULL DEFAULT 0,
    "faseAtual" "FaseTimer" NOT NULL DEFAULT 'FOCO',
    "cicloAtual" INTEGER NOT NULL DEFAULT 1,
    "finalizada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sessoes_estudo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "configuracoes_timer" ADD CONSTRAINT "configuracoes_timer_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes_estudo" ADD CONSTRAINT "sessoes_estudo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes_estudo" ADD CONSTRAINT "sessoes_estudo_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "configuracoes_timer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed presets
INSERT INTO "configuracoes_timer" ("id", "nome", "duracaoFocoMin", "duracaoPausaCurtaMin", "duracaoPausaLongaMin", "ciclosAtePausaLonga", "ehPreset", "tipo", "criadoEm")
VALUES
  ('preset_classico', 'Pomodoro Clássico', 25, 5, 15, 4, true, 'CLASSICO', CURRENT_TIMESTAMP),
  ('preset_intenso', 'Foco Intenso (50/10)', 50, 10, 20, 2, true, 'CLASSICO', CURRENT_TIMESTAMP);
