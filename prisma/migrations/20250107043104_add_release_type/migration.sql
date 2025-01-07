-- CreateEnum
CREATE TYPE "SalaryReleaseType" AS ENUM ('MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "releaseType" "SalaryReleaseType" NOT NULL DEFAULT 'MONTHLY';

-- CreateTable
CREATE TABLE "IdentityVerification" (
    "id" UUID NOT NULL,

    CONSTRAINT "IdentityVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryRelease" (
    "id" UUID NOT NULL,

    CONSTRAINT "SalaryRelease_pkey" PRIMARY KEY ("id")
);
