import { randomUUID } from "crypto";
import { db } from "../db/client.js";
import { Note } from "../models/note.js";

function normalizeNote(row: any): Note {
    return {
        id: row.id,
        title: row.title ?? "",
        content: row.content,
        task_id: row.task_id ?? null,
        calendar_event_id: row.calendar_event_id ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at ?? null,
    };
}

export function createNote(note: Omit<Note, "id">): string {
    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(
        `
    INSERT INTO notes (id, title, content, task_id, calendar_event_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    ).run(
        id,
        note.title ?? "",
        note.content,
        note.task_id ?? null,
        note.calendar_event_id ?? null,
        now,
        now,
    );

    return id;
}

export function listNotes(limit?: number): Note[] {
    const query = limit
        ? `SELECT * FROM notes ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM notes ORDER BY created_at DESC`;

    const rows = limit ? db.prepare(query).all(limit) : db.prepare(query).all();

    return rows.map(normalizeNote);
}

export function updateNote(note: Note): boolean {
    if (!note.id) throw new Error("id is required for update");

    const exists = db.prepare(`SELECT id FROM notes WHERE id = ?`).get(note.id);
    if (!exists) return false;

    db.prepare(
        `
    UPDATE notes
    SET title = ?, content = ?, task_id = ?, calendar_event_id = ?, updated_at = ?
    WHERE id = ?
  `,
    ).run(
        note.title ?? "",
        note.content,
        note.task_id ?? null,
        note.calendar_event_id ?? null,
        new Date().toISOString(),
        note.id,
    );

    return true;
}

export function deleteNote(id: string): boolean {
    const result = db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    return result.changes > 0;
}

export function deleteAllNotes() {
    const notes = listNotes();
    const deleted_ids: string[] = [];

    for (const note of notes) {
        if (!note.id) {
            continue;
        }

        if (deleteNote(note.id)) {
            deleted_ids.push(note.id);
        }
    }

    return {
        deleted_count: deleted_ids.length,
        deleted_ids,
        matched_count: notes.length,
    };
}

export function deleteNotesByCalendarEvent(calendar_event_id?: string | null) {
    const notes = listNotes();
    const targetEventId = calendar_event_id ?? null;

    const candidates = notes.filter((note) => {
        if (targetEventId) {
            return note.calendar_event_id === targetEventId;
        }

        return Boolean(note.calendar_event_id);
    });

    const deleted_ids: string[] = [];

    for (const note of candidates) {
        if (!note.id) {
            continue;
        }

        if (deleteNote(note.id)) {
            deleted_ids.push(note.id);
        }
    }

    return {
        deleted_count: deleted_ids.length,
        deleted_ids,
        matched_count: candidates.length,
        calendar_event_id: targetEventId,
    };
}
