/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `ProductStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `ProductStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductStock" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductStock_code_key" ON "ProductStock"("code");
