/*
  Warnings:

  - You are about to drop the column `gitlabPath` on the `Message` table. All the data in the column will be lost.
  - Added the required column `gitlabProjectId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `gitlabPath`,
    ADD COLUMN `gitlabProjectId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD FOREIGN KEY (`gitlabProjectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
