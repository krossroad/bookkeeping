/*
 Warnings:

 - Added the required column `salrayAccountedTill` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE
    "employees"
ADD
    COLUMN "salaryAccountedTill" DATE NOT NULL DEFAULT NOW() :: date - 1;
