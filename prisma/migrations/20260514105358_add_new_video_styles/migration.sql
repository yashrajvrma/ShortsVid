-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VideoStyle" ADD VALUE 'COMIC';
ALTER TYPE "VideoStyle" ADD VALUE 'PIXAR';
ALTER TYPE "VideoStyle" ADD VALUE 'MANGA';
ALTER TYPE "VideoStyle" ADD VALUE 'ILLUSTRATION';
ALTER TYPE "VideoStyle" ADD VALUE 'CARTOON_3D';
