/*
  Warnings:

  - The values [slide_up] on the enum `AnimationPreset` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AnimationPreset_new" AS ENUM ('pop', 'fade', 'slide', 'none');
ALTER TABLE "caption_config" ALTER COLUMN "animationPreset" TYPE "AnimationPreset_new" USING ("animationPreset"::text::"AnimationPreset_new");
ALTER TYPE "AnimationPreset" RENAME TO "AnimationPreset_old";
ALTER TYPE "AnimationPreset_new" RENAME TO "AnimationPreset";
DROP TYPE "public"."AnimationPreset_old";
COMMIT;
