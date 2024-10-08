/*
  Warnings:

  - You are about to drop the `project_techs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_techs" DROP CONSTRAINT "project_techs_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_techs" DROP CONSTRAINT "project_techs_techId_fkey";

-- DropTable
DROP TABLE "project_techs";

-- CreateTable
CREATE TABLE "_ProjectToTech" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTech_AB_unique" ON "_ProjectToTech"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTech_B_index" ON "_ProjectToTech"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTech" ADD CONSTRAINT "_ProjectToTech_A_fkey" FOREIGN KEY ("A") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTech" ADD CONSTRAINT "_ProjectToTech_B_fkey" FOREIGN KEY ("B") REFERENCES "techs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
