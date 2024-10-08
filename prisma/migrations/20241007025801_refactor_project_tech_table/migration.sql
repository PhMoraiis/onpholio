/*
  Warnings:

  - The values [DEVELOPMENT,INTERRUPTED] on the enum `stats` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `order` on the `project_techs` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "stats_new" AS ENUM ('ONLINE', 'DESENVOLVIMENTO', 'INTERROMPIDO');
ALTER TABLE "projects" ALTER COLUMN "status" TYPE "stats_new" USING ("status"::text::"stats_new");
ALTER TYPE "stats" RENAME TO "stats_old";
ALTER TYPE "stats_new" RENAME TO "stats";
DROP TYPE "stats_old";
COMMIT;

-- AlterTable
ALTER TABLE "project_techs" DROP COLUMN "order";
