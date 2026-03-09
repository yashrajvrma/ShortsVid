/*
  Warnings:

  - The values [REALISTIC,CLIPART] on the enum `VideoStyle` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VideoStyle_new" AS ENUM ('PHOTO_REALISTIC', 'CARTOON', 'ANIME', 'CYBERPUNK', 'CINEMATIC', 'PIXEL_ART', 'COLORFUL_COMICS');
ALTER TABLE "video" ALTER COLUMN "videoStyle" TYPE "VideoStyle_new" USING ("videoStyle"::text::"VideoStyle_new");
ALTER TYPE "VideoStyle" RENAME TO "VideoStyle_old";
ALTER TYPE "VideoStyle_new" RENAME TO "VideoStyle";
DROP TYPE "public"."VideoStyle_old";
COMMIT;
