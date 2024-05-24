/*
  Warnings:

  - You are about to drop the column `studentId` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `nim` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_studentId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "studentId",
ADD COLUMN     "nim" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Student"("nim") ON DELETE RESTRICT ON UPDATE CASCADE;
