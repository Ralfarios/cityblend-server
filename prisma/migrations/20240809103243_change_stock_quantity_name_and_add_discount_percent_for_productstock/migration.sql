/*
  Warnings:

  - You are about to drop the column `stockQuantity` on the `ProductStock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductStock" DROP COLUMN "stockQuantity",
ADD COLUMN     "discount_percent" INTEGER DEFAULT 0,
ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0;
