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

export const createCalendarEvent = tool(
    async (input: any) => {
        const { title, description, start, end } = input;

        const result = await createCalendarEventViaMcp({
            title,
            description,
            start,
            end,
        });

        return JSON.stringify({
            success: true,
            message: "Event created successfully",
            data: result,
        });
    },
    {
        name: "create_calendar_event",
        description: "Create a calendar event",
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
