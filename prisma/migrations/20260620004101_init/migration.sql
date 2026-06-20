-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "anonymousId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "mascot" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "homeCulture" TEXT NOT NULL,
    "uiLanguage" TEXT NOT NULL,
    "keyboardLayout" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "classCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_classCode_fkey" FOREIGN KEY ("classCode") REFERENCES "Classroom" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "cultureId" TEXT NOT NULL,
    "wpm" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "timeSpentSec" INTEGER NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgressLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpeedTestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "wpm" REAL NOT NULL,
    "accuracy" REAL NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "cultureId" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SpeedTestSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "questCode" TEXT NOT NULL,
    "localDate" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestCompletion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StickerUnlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "stickerKey" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StickerUnlock_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessoryUnlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "accessoryKey" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AccessoryUnlock_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_email_idx" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");

-- CreateIndex
CREATE INDEX "Classroom_code_idx" ON "Classroom"("code");

-- CreateIndex
CREATE INDEX "Classroom_teacherId_idx" ON "Classroom"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_anonymousId_key" ON "Student"("anonymousId");

-- CreateIndex
CREATE INDEX "Student_anonymousId_idx" ON "Student"("anonymousId");

-- CreateIndex
CREATE INDEX "Student_classCode_idx" ON "Student"("classCode");

-- CreateIndex
CREATE INDEX "Student_lastSeenAt_idx" ON "Student"("lastSeenAt");

-- CreateIndex
CREATE INDEX "ProgressLog_studentId_idx" ON "ProgressLog"("studentId");

-- CreateIndex
CREATE INDEX "ProgressLog_studentId_completedAt_idx" ON "ProgressLog"("studentId", "completedAt");

-- CreateIndex
CREATE INDEX "ProgressLog_studentId_lessonId_idx" ON "ProgressLog"("studentId", "lessonId");

-- CreateIndex
CREATE INDEX "SpeedTestSession_studentId_idx" ON "SpeedTestSession"("studentId");

-- CreateIndex
CREATE INDEX "SpeedTestSession_studentId_wpm_idx" ON "SpeedTestSession"("studentId", "wpm");

-- CreateIndex
CREATE INDEX "SpeedTestSession_studentId_completedAt_idx" ON "SpeedTestSession"("studentId", "completedAt");

-- CreateIndex
CREATE INDEX "QuestCompletion_studentId_idx" ON "QuestCompletion"("studentId");

-- CreateIndex
CREATE INDEX "QuestCompletion_studentId_localDate_idx" ON "QuestCompletion"("studentId", "localDate");

-- CreateIndex
CREATE UNIQUE INDEX "QuestCompletion_studentId_questCode_localDate_key" ON "QuestCompletion"("studentId", "questCode", "localDate");

-- CreateIndex
CREATE INDEX "StickerUnlock_studentId_idx" ON "StickerUnlock"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StickerUnlock_studentId_stickerKey_key" ON "StickerUnlock"("studentId", "stickerKey");

-- CreateIndex
CREATE INDEX "AccessoryUnlock_studentId_idx" ON "AccessoryUnlock"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryUnlock_studentId_accessoryKey_key" ON "AccessoryUnlock"("studentId", "accessoryKey");
