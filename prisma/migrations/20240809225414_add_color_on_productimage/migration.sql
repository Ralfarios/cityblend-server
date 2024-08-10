-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "color_id" TEXT;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
