PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

ALTER TABLE members RENAME TO members_old;

CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  address TEXT,
  phone TEXT NOT NULL,
  joined_at TEXT,
  baptized_at TEXT,
  class_name TEXT NOT NULL CHECK (class_name IN ('Primarios', 'Infantil', 'Adolescentes', 'Jovens', 'Adultos')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO members (id, full_name, birth_date, address, phone, joined_at, baptized_at, class_name, created_at, updated_at)
SELECT id, full_name, birth_date, address, phone, joined_at, baptized_at, class_name, created_at, updated_at
FROM members_old;

DROP TABLE members_old;

CREATE INDEX IF NOT EXISTS idx_members_class_name ON members(class_name);

COMMIT;
PRAGMA foreign_keys = ON;
