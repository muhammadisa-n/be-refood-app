/*
  Warnings:

  - A unique constraint covering the columns `[no_hp]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_no_hp_key` ON `users`(`no_hp`);
