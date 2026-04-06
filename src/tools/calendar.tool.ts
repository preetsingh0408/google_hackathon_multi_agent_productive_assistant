import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createCalendarEventViaMcp,
    listCalendarEventsViaMcp,
    deleteCalendarEventViaMcp,
    updateCalendarEventViaMcp,
} from "../services/calendarMcp.service.js";

const createCalendarEventSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    start: z.string(),
    end: z.string(),
});

const listCalendarEventsSchema = z.object({});

const deleteCalendarEventSchema = z.object({
    id: z.string(),
});

const updateCalendarEventSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
});

function normalizeIsoDateTime(value?: string) {
    if (!value) return value;

    const trimmed = value.trim();

    // already has timezone
    if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(trimmed)) return trimmed;

    // add seconds + Z
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
        return `${trimmed}:00Z`;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
        return `${trimmed}Z`;
    }

    return trimmed;
}

function unwrapMcp(result: any) {
    const isError = result?.isError;

    const text = result?.content?.find((c: any) => c.type === "text")?.text;

    if (!text) return { ok: !isError, data: result };

    try {
        return { ok: !isError, data: JSON.parse(text) };
    } catch {
        return { ok: !isError, data: text };
    }
}

export const createCalendarEvent = tool(
    async (input: any) => {
        try {
            const result = await createCalendarEventViaMcp({
                title: input.title,
                description: input.description,
                start: normalizeIsoDateTime(input.start) as string,
                end: normalizeIsoDateTime(input.end) as string,
            });

            const parsed = unwrapMcp(result);

            if (!parsed.ok) {
                return JSON.stringify({ success: false, error: parsed.data });
            }

            return JSON.stringify({
                success: true,
                data: parsed.data, // 👈 flat JSON
            });
        } catch (err: any) {
            return JSON.stringify({
                success: false,
                error: err.message,
            });
        }
    },
    {
        name: "create_calendar_event",
        description:
            "Create calendar event. start/end MUST be ISO datetime with timezone (e.g. 2026-04-07T21:00:00Z)",
        schema: createCalendarEventSchema,
    } as any,
);

export const listCalendarEvents = tool(
    async (_input: any) => {
        const result = await listCalendarEventsViaMcp();

        return JSON.stringify({
            success: true,
            message: "Fetched scheduled events",
            data: result,
        });
    },
    {
        name: "list_calendar_events",
        description: "Retrieve all scheduled calendar events",
        schema: listCalendarEventsSchema,
    } as any,
);

export const deleteCalendarEvent = tool(
    async (input: any) => {
        const { id } = input;

        const result = await deleteCalendarEventViaMcp({
            id,
        });

        return JSON.stringify({
            success: true,
            message: `Event ${id} deleted successfully`,
            data: result,
        });
    },
    {
        name: "delete_calendar_event",
        description: "Delete a calendar event by event ID",
        schema: deleteCalendarEventSchema,
    } as any,
);

export const updateCalendarEvent = tool(
    async (input: any) => {
        const { id, title, description, start, end } = input;

        const result = await updateCalendarEventViaMcp({
            id,
            title,
            description,
            start,
            end,
        });

        return JSON.stringify({
            success: true,
            message: `Event ${id} updated successfully`,
            data: result,
        });
    },
    {
        name: "update_calendar_event",
        description: "Update a calendar event by event ID",
        schema: updateCalendarEventSchema,
    } as any,
);
