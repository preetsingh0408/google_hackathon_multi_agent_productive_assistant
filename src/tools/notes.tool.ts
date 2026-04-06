import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createNoteViaMcp,
    listNotesViaMcp,
    updateNoteViaMcp,
    deleteNoteViaMcp,
} from "../services/productivityMcp.service.js";

export const createNoteTool = tool(
    async (input: any) => JSON.stringify(await createNoteViaMcp(input)),
    {
        name: "create_note",
        description: "Create a note",
        schema: z.object({
            title: z.string().optional(),
            content: z.string(),
            task_id: z.string().nullable().optional(),
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);

export const listNotesTool = tool(
    async (input: any) => JSON.stringify(await listNotesViaMcp(input)),
    {
        name: "list_notes",
        description: "List notes",
        schema: z.object({
            limit: z.number().optional(),
        }),
    } as any,
);

export const updateNoteTool = tool(
    async (input: any) => JSON.stringify(await updateNoteViaMcp(input)),
    {
        name: "update_note",
        description: "Update a note",
        schema: z.object({
            id: z.string(),
            title: z.string().optional(),
            content: z.string(),
            task_id: z.string().nullable().optional(),
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);

export const deleteNoteTool = tool(
    async (input: any) => JSON.stringify(await deleteNoteViaMcp(input)),
    {
        name: "delete_note",
        description: "Delete a note",
        schema: z.object({
            id: z.string(),
        }),
    } as any,
);
