-- CreateTable
CREATE TABLE "CheckIn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" INTEGER NOT NULL,
    CONSTRAINT "CheckIn_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckIn_attendee-id_key" ON "CheckIn"("attendee-id");
