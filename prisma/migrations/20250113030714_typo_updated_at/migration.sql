/*
  Warnings:

  - You are about to drop the column `uppdatedAt` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "uppdatedAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
