/*
  Warnings:

  - You are about to drop the column `darkImageDesktop` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `darkImageMobile` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `lightImageDesktop` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `lightImageMobile` on the `projects` table. All the data in the column will be lost.
  - Added the required column `order` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "ImageSize" AS ENUM ('DESKTOP', 'MOBILE');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "darkImageDesktop",
DROP COLUMN "darkImageMobile",
DROP COLUMN "lightImageDesktop",
DROP COLUMN "lightImageMobile",
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "size" "ImageSize" NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
