/*
  Warnings:

  - Added the required column `superCategoryId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "superCategoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SuperCategory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "svName" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "priority" INTEGER,

    CONSTRAINT "SuperCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperCategory_slug_key" ON "SuperCategory"("slug");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_superCategoryId_fkey" FOREIGN KEY ("superCategoryId") REFERENCES "SuperCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
