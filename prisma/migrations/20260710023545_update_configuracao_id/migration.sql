-- DropForeignKey
ALTER TABLE "sessoes_estudo" DROP CONSTRAINT "sessoes_estudo_configuracaoId_fkey";

-- AlterTable
ALTER TABLE "sessoes_estudo" ALTER COLUMN "configuracaoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sessoes_estudo" ADD CONSTRAINT "sessoes_estudo_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "configuracoes_timer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
