import { z } from "zod";
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

const taskSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().optional(),
    status: z.enum(["pending", "in_progress", "done"]).optional(),
    priority: z.string().trim().optional(),
    due_date: z.string().trim().optional(),
    calendar_event_id: z.string().trim().nullable().optional(),
});

const taskWithIdSchema = taskSchema.extend({
    id: z.string().min(1),
});

const noteSchema = z.object({
    title: z.string().trim().optional(),
    content: z.string().trim().min(1),
    task_id: z.string().trim().nullable().optional(),
    calendar_event_id: z.string().trim().nullable().optional(),
});

const noteWithIdSchema = noteSchema.extend({
    id: z.string().min(1),
});

export function registerTaskNoteTools(mcpServer: any) {
    mcpServer.registerTool(
        "create_task",
        {
            description: "Create a new task.",
            inputSchema: taskSchema,
        },
        async (args: any) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ id: createTask(args), ...args }),
                },
            ],
        }),
    );

    mcpServer.registerTool(
        "list_tasks",
        {
            description: "List all tasks.",
            inputSchema: z.object({
                limit: z.number().int().positive().optional(),
            }),
        },
        async ({ limit }: { limit?: number }) => ({
            content: [{ type: "text", text: JSON.stringify(listTasks(limit)) }],
        }),
    );

    mcpServer.registerTool(
        "update_task",
        {
            description: "Update a task by id.",
            inputSchema: taskWithIdSchema,
        },
        async (args: any) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ updated: updateTask(args) }),
                },
            ],
        }),
    );

    mcpServer.registerTool(
        "delete_task",
        {
            description: "Delete a task by id.",
            inputSchema: z.object({ id: z.string().min(1) }),
        },
        async ({ id }: { id: string }) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ deleted: deleteTask(id) }),
                },
            ],
        }),
    );

    mcpServer.registerTool(
        "create_note",
        {
            description: "Create a new note.",
            inputSchema: noteSchema,
        },
        async (args: any) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ id: createNote(args), ...args }),
                },
            ],
        }),
    );

    mcpServer.registerTool(
        "list_notes",
        {
            description: "List all notes.",
            inputSchema: z.object({
                limit: z.number().int().positive().optional(),
            }),
        },
        async ({ limit }: { limit?: number }) => ({
            content: [{ type: "text", text: JSON.stringify(listNotes(limit)) }],
        }),
    );

    mcpServer.registerTool(
        "update_note",
        {
            description: "Update a note by id.",
            inputSchema: noteWithIdSchema,
        },
        async (args: any) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ updated: updateNote(args) }),
                },
            ],
        }),
    );

    mcpServer.registerTool(
        "delete_note",
        {
            description: "Delete a note by id.",
            inputSchema: z.object({ id: z.string().min(1) }),
        },
        async ({ id }: { id: string }) => ({
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ deleted: deleteNote(id) }),
                },
            ],
        }),
    );
}
