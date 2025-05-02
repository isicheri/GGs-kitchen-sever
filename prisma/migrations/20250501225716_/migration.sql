/*
  Warnings:

  - Added the required column `paid` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaidType" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paid" "PaidType" NOT NULL;
