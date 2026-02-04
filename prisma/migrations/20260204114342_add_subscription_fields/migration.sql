-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'Hobby',
ADD COLUMN     "subscriptionStatus" TEXT;
