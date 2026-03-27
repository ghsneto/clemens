PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

ALTER TABLE attendance_records RENAME TO attendance_records_old;

CREATE TABLE attendance_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sunday_date TEXT NOT NULL,
  class_name TEXT NOT NULL CHECK (class_name IN ('Primarios', 'Infantil', 'Adolescentes', 'Jovens', 'Adultos')),
  member_id INTEGER NOT NULL,
  present INTEGER NOT NULL DEFAULT 0,
  chapters_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (sunday_date, class_name, member_id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

INSERT INTO attendance_records (id, sunday_date, class_name, member_id, present, chapters_read, created_at, updated_at)
SELECT id, sunday_date, class_name, member_id, present, chapters_read, created_at, updated_at
FROM attendance_records_old;

DROP TABLE attendance_records_old;

CREATE INDEX IF NOT EXISTS idx_attendance_sunday ON attendance_records(sunday_date);

COMMIT;
PRAGMA foreign_keys = ON;
