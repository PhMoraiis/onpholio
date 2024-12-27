/*
  Warnings:

  - You are about to drop the column `type` on the `images` table. All the data in the column will be lost.
  - Added the required column `theme` to the `images` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "image_themes" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "image_sizes" AS ENUM ('DESKTOP', 'MOBILE');

-- AlterTable
ALTER TABLE "_ProjectToTech" ADD CONSTRAINT "_ProjectToTech_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProjectToTech_AB_unique";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "type",
ADD COLUMN     "theme" "image_themes" NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" "image_sizes" NOT NULL;

-- DropEnum
DROP TYPE "ImageSize";

-- DropEnum
DROP TYPE "ImageType";
