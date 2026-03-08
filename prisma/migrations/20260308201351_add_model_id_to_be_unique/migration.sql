/*
  Warnings:

  - A unique constraint covering the columns `[modelId]` on the table `voice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "voice_modelId_key" ON "voice"("modelId");
