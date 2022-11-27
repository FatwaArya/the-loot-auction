/*
  Warnings:

  - You are about to drop the column `__v` on the `MerchantItems` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "itemName_1";

-- AlterTable
ALTER TABLE "MerchantItems" DROP COLUMN "__v",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);
