/*
  Warnings:

  - Made the column `image` on table `techs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "techs" ALTER COLUMN "image" SET NOT NULL;
