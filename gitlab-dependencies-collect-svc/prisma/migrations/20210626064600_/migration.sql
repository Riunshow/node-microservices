/*
  Warnings:

  - You are about to drop the column `groupId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `pid` on the `Project` table. All the data in the column will be lost.
  - Added the required column `gid` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gid` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `project_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `project_ibfk_1`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `gid` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `groupId`,
    DROP COLUMN `pid`,
    ADD COLUMN `gid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Group` ADD FOREIGN KEY (`gid`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`gid`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
