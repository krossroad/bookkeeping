/*
 Warnings:

 - Added the required column `salaryBalance` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE
    "employees"
ADD
    COLUMN "salaryBalance" INTEGER NOT NULL DEFAULT 0
