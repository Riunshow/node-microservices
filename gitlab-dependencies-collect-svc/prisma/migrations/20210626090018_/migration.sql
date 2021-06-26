/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,path]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,path]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Group.name_path_index` ON `Group`;

-- DropIndex
DROP INDEX `Project.name_path_index` ON `Project`;

-- CreateTable
CREATE TABLE `Dependencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pid` INTEGER NOT NULL,

    UNIQUE INDEX `Dependencies.name_version_unique`(`name`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Group.name_unique` ON `Group`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Group.name_path_unique` ON `Group`(`name`, `path`);

-- CreateIndex
CREATE UNIQUE INDEX `Project.name_path_unique` ON `Project`(`name`, `path`);

-- AddForeignKey
ALTER TABLE `Dependencies` ADD FOREIGN KEY (`pid`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
