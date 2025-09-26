/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."account" DROP CONSTRAINT "account_userId_fkey";

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "robloxUsername" TEXT;

-- DropTable
DROP TABLE "public"."account";

-- DropTable
DROP TABLE "public"."verification";
