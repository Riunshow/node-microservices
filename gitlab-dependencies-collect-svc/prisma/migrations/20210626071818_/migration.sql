-- CreateIndex
CREATE INDEX `Group.name_path_index` ON `Group`(`name`, `path`);

-- CreateIndex
CREATE INDEX `Project.name_path_index` ON `Project`(`name`, `path`);
