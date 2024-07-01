-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckIn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" INTEGER NOT NULL,
    CONSTRAINT "CheckIn_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CheckIn" ("attendee-id", "created-at", "id") SELECT "attendee-id", "created-at", "id" FROM "CheckIn";
DROP TABLE "CheckIn";
ALTER TABLE "new_CheckIn" RENAME TO "CheckIn";
CREATE UNIQUE INDEX "CheckIn_attendee-id_key" ON "CheckIn"("attendee-id");
CREATE TABLE "new_attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event-id" TEXT NOT NULL,
    CONSTRAINT "attendees_event-id_fkey" FOREIGN KEY ("event-id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendees" ("created_at", "email", "event-id", "id", "name") SELECT "created_at", "email", "event-id", "id", "name" FROM "attendees";
DROP TABLE "attendees";
ALTER TABLE "new_attendees" RENAME TO "attendees";
CREATE UNIQUE INDEX "attendees_event-id_email_key" ON "attendees"("event-id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
