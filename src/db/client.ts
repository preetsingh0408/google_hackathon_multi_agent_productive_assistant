import { Database } from "bun:sqlite";

export const db = new Database("app.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT,
    due_date TEXT,
    calendar_event_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    task_id TEXT,
    calendar_event_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );
`);
