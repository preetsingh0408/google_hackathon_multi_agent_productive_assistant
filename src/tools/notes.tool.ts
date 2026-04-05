import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createNote, listNotes } from "../services/notes.service.js";

export const createNoteTool = tool(
    async (input: { title?: string; content: string }) => {
        const note = createNote({ title: input.title, content: input.content });

        return JSON.stringify({
            success: true,
            message: "Note created successfully",
            note,
        });
    },
    {
        name: "create_note",
        description: "Create a note in the local productivity database.",
        schema: z.object({
            title: z.string().optional(),
            content: z.string(),
        }),
    } as any,
);

export const listNotesTool = tool(
    async () => {
        const notes = listNotes();

        return JSON.stringify({
            success: true,
            count: notes.length,
            notes,
        });
    },
    {
        name: "list_notes",
        description: "List all notes from the local productivity database.",
        schema: z.object({}),
    } as any,
);
