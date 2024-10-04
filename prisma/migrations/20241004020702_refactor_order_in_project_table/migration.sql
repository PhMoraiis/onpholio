/*
  Warnings:

  - You are about to drop the column `order` on the `techs` table. All the data in the column will be lost.
  - You are about to drop the `_ProjectToTech` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToTech" DROP CONSTRAINT "_ProjectToTech_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTech" DROP CONSTRAINT "_ProjectToTech_B_fkey";

-- AlterTable
ALTER TABLE "techs" DROP COLUMN "order";

-- DropTable
DROP TABLE "_ProjectToTech";

-- CreateTable
CREATE TABLE "project_techs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "techId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "project_techs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_techs_projectId_techId_key" ON "project_techs"("projectId", "techId");

-- AddForeignKey
ALTER TABLE "project_techs" ADD CONSTRAINT "project_techs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_techs" ADD CONSTRAINT "project_techs_techId_fkey" FOREIGN KEY ("techId") REFERENCES "techs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
