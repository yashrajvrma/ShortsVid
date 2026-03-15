/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `caption_config` table. All the data in the column will be lost.
  - You are about to drop the column `fontType` on the `caption_config` table. All the data in the column will be lost.
  - Added the required column `animationPreset` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fontFamily` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fontWeight` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highlightStrokeColor` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horizontalPosition` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterSpacing` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lightLeakHue` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lightLeakSeed` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxLines` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxWordsPerLine` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popBackgroundColor` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shadowBlur` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shadowOffsetY` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textTransform` to the `caption_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verticalPosition` to the `caption_config` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TextTransform" AS ENUM ('uppercase', 'lowercase', 'capitalize', 'none');

-- CreateEnum
CREATE TYPE "AnimationPreset" AS ENUM ('pop', 'fade', 'slide_up', 'none');

-- AlterTable
ALTER TABLE "caption_config" DROP COLUMN "backgroundColor",
DROP COLUMN "fontType",
ADD COLUMN     "animationPreset" "AnimationPreset" NOT NULL,
ADD COLUMN     "fontFamily" TEXT NOT NULL,
ADD COLUMN     "fontWeight" TEXT NOT NULL,
ADD COLUMN     "highlightStrokeColor" TEXT NOT NULL,
ADD COLUMN     "horizontalPosition" INTEGER NOT NULL,
ADD COLUMN     "letterSpacing" INTEGER NOT NULL,
ADD COLUMN     "lightLeakHue" INTEGER NOT NULL,
ADD COLUMN     "lightLeakSeed" INTEGER NOT NULL,
ADD COLUMN     "maxLines" INTEGER NOT NULL,
ADD COLUMN     "maxWordsPerLine" INTEGER NOT NULL,
ADD COLUMN     "popBackgroundColor" TEXT NOT NULL,
ADD COLUMN     "shadowBlur" INTEGER NOT NULL,
ADD COLUMN     "shadowOffsetY" INTEGER NOT NULL,
ADD COLUMN     "textTransform" "TextTransform" NOT NULL,
ADD COLUMN     "verticalPosition" INTEGER NOT NULL;
