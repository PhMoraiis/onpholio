/*
  Warnings:

  - You are about to drop the column `size` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `techs` table. All the data in the column will be lost.
  - Added the required column `final_date` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_date` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "size",
DROP COLUMN "theme";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "final_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "initial_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "techs" DROP COLUMN "image";

-- DropEnum
DROP TYPE "image_sizes";

-- DropEnum
DROP TYPE "image_themes";

-- DropEnum
DROP TYPE "stats";
