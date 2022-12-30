/*
  Warnings:

  - You are about to drop the column `deleted` on the `Planet` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Planet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "diameter" TEXT NOT NULL,
    "gravity" TEXT NOT NULL,
    "terrain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME
);
INSERT INTO "new_Planet" ("createdAt", "deletedAt", "diameter", "gravity", "id", "name", "terrain", "updatedAt") SELECT "createdAt", "deletedAt", "diameter", "gravity", "id", "name", "terrain", "updatedAt" FROM "Planet";
DROP TABLE "Planet";
ALTER TABLE "new_Planet" RENAME TO "Planet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
