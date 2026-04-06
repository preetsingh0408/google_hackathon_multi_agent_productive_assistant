import {
    createTask,
    listTasks,
    updateTask,
    deleteTask,
} from "../controllers/taskController.js";
import {
    createNote,
    listNotes,
    updateNote,
    deleteNote,
} from "../controllers/noteController.js";

export async function createTaskViaMcp(input: any) {
    const id = createTask(input);
    return { id, ...input };
}

export async function listTasksViaMcp(input?: { limit?: number }) {
    return listTasks(input?.limit);
}

export async function updateTaskViaMcp(input: any) {
    return { updated: updateTask(input) };
}

export async function deleteTaskViaMcp(input: { id: string }) {
    return { deleted: deleteTask(input.id) };
}

export async function createNoteViaMcp(input: any) {
    const id = createNote(input);
    return { id, ...input };
}

export async function listNotesViaMcp(input?: { limit?: number }) {
    return listNotes(input?.limit);
}

export async function updateNoteViaMcp(input: any) {
    return { updated: updateNote(input) };
}

export async function deleteNoteViaMcp(input: { id: string }) {
    return { deleted: deleteNote(input.id) };
}
