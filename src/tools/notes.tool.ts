import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createNoteViaMcp,
    listNotesViaMcp,
    updateNoteViaMcp,
    deleteNoteViaMcp,
    deleteNotesByCalendarEventViaMcp,
} from "../services/productivityMcp.service.js";
import { withTiming } from "../utils/logger.js";

export const createNoteTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "create_note",
            async () => JSON.stringify(await createNoteViaMcp(input)),
            { input },
        ),
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
    async (input: any) =>
        withTiming(
            "tool",
            "list_notes",
            async () => JSON.stringify(await listNotesViaMcp(input)),
            { input },
        ),
    {
        name: "list_notes",
        description: "List notes",
        schema: z.object({
            limit: z.number().optional(),
        }),
    } as any,
);

export const updateNoteTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "update_note",
            async () => JSON.stringify(await updateNoteViaMcp(input)),
            { input },
        ),
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
    async (input: any) =>
        withTiming(
            "tool",
            "delete_note",
            async () => JSON.stringify(await deleteNoteViaMcp(input)),
            { input },
        ),
    {
        name: "delete_note",
        description: "Delete a note",
        schema: z.object({
            id: z.string(),
        }),
    } as any,
);

export const deleteMeetingNotesTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "delete_meeting_notes",
            async () =>
                JSON.stringify(await deleteNotesByCalendarEventViaMcp(input)),
            { input },
        ),
    {
        name: "delete_meeting_notes",
        description:
            "Delete notes linked to meetings. If calendar_event_id is omitted, deletes all notes that have calendar_event_id.",
        schema: z.object({
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);
