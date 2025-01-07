/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "CreatedAt",
DROP COLUMN "UpdatedAt",
ADD COLUMN     "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ(0),
ADD COLUMN     "uppdatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
