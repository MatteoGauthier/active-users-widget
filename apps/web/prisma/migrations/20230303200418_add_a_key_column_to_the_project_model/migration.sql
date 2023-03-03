/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_key_key" ON "Project"("key");
