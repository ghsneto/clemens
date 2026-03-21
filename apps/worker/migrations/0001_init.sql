PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  client_name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  joined_at TEXT NOT NULL,
  baptized_at TEXT NOT NULL,
  class_name TEXT NOT NULL CHECK (class_name IN ('Primarios', 'Infantil', 'Adolescentes', 'Jovens', 'Adultos')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_records (
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

CREATE TABLE IF NOT EXISTS offerings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sunday_date TEXT NOT NULL,
  class_name TEXT NOT NULL CHECK (class_name IN ('Primarios', 'Infantil', 'Adolescentes', 'Jovens', 'Adultos')),
  amount REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (sunday_date, class_name)
);

CREATE TABLE IF NOT EXISTS meeting_minutes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_date TEXT NOT NULL,
  meeting_type TEXT NOT NULL CHECK (meeting_type IN ('ordinaria', 'extraordinaria')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agenda_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  starts_at TEXT NOT NULL,
  recurrence_rule TEXT,
  google_event_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_class_name ON members(class_name);
CREATE INDEX IF NOT EXISTS idx_attendance_sunday ON attendance_records(sunday_date);
CREATE INDEX IF NOT EXISTS idx_offerings_sunday ON offerings(sunday_date);
CREATE INDEX IF NOT EXISTS idx_agenda_starts_at ON agenda_events(starts_at);

INSERT INTO users (full_name, client_name, email, phone, password)
VALUES ('Administrador Clemens', 'cliente-demo', 'admin@clemens.app', '(00) 00000-0000', '123456')
ON CONFLICT(client_name) DO NOTHING;
