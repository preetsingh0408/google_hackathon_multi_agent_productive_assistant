import { randomUUID } from "crypto";
import { db } from "../db/client.js";
import { Task } from "../models/task.js";

function normalizeTask(row: any): Task {
    return {
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        status: row.status ?? "pending",
        priority: row.priority ?? "",
        due_date: row.due_date ?? "",
        calendar_event_id: row.calendar_event_id ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at ?? null,
    };
}

export function createTask(task: Omit<Task, "id">): string {
    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(
        `
    INSERT INTO tasks (id, title, description, status, priority, due_date, calendar_event_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    ).run(
        id,
        task.title,
        task.description ?? "",
        task.status ?? "pending",
        task.priority ?? "",
        task.due_date ?? "",
        task.calendar_event_id ?? null,
        now,
        now,
    );

    return id;
}

export function listTasks(limit?: number): Task[] {
    const query = limit
        ? `SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM tasks ORDER BY created_at DESC`;

    const rows = limit ? db.prepare(query).all(limit) : db.prepare(query).all();

    return rows.map(normalizeTask);
}

export function updateTask(task: Task): boolean {
    if (!task.id) throw new Error("id is required for update");

    const exists = db.prepare(`SELECT id FROM tasks WHERE id = ?`).get(task.id);
    if (!exists) return false;

    db.prepare(
        `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, calendar_event_id = ?, updated_at = ?
    WHERE id = ?
  `,
    ).run(
        task.title,
        task.description ?? "",
        task.status ?? "pending",
        task.priority ?? "",
        task.due_date ?? "",
        task.calendar_event_id ?? null,
        new Date().toISOString(),
        task.id,
    );

    return true;
}

export function deleteTask(id: string): boolean {
    const result = db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
    return result.changes > 0;
}
