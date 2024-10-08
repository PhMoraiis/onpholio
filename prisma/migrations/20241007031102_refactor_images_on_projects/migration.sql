/*
  Warnings:

  - You are about to drop the column `imagesDesktop` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `imagesMobile` on the `projects` table. All the data in the column will be lost.
  - Added the required column `lightImageDesktop` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lightImageMobile` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "imagesDesktop",
DROP COLUMN "imagesMobile",
ADD COLUMN     "darkImageDesktop" TEXT,
ADD COLUMN     "darkImageMobile" TEXT,
ADD COLUMN     "lightImageDesktop" TEXT NOT NULL,
ADD COLUMN     "lightImageMobile" TEXT NOT NULL;
