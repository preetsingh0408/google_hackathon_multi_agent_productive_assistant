import express from "express";
import { supervisorAgent } from "../agents/supervisor.agent.js";
import { listCalendarEventsViaMcp } from "../services/calendarMcp.service.js";
import {
    listTasksViaMcp,
    listNotesViaMcp,
} from "../services/productivityMcp.service.js";

export function createServer() {
    const app = express();
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ success: true, message: "OK" });
    });

    app.post("/chat", async (req, res) => {
        try {
            const { message } = req.body as { message?: string };

            if (!message?.trim()) {
                return res.status(400).json({
                    success: false,
                    error: "message is required",
                });
            }

            const result = await supervisorAgent.invoke({
                messages: [{ role: "user", content: message }],
            });

            const lastMessage = result.messages[result.messages.length - 1];
            const finalText =
                typeof lastMessage?.content === "string"
                    ? lastMessage.content
                    : JSON.stringify(lastMessage?.content ?? "");

            return res.json({
                success: true,
                message: finalText,
                raw: result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    // ✅ Now using MCP-style layer
    app.get("/tasks", async (_req, res) => {
        const tasks = await listTasksViaMcp();

        res.json({
            success: true,
            tasks,
        });
    });

    // ✅ Now using MCP-style layer
    app.get("/notes", async (_req, res) => {
        const notes = await listNotesViaMcp();

        res.json({
            success: true,
            notes,
        });
    });

    app.get("/schedule", async (_req, res) => {
        try {
            const schedules = await listCalendarEventsViaMcp();

            return res.json({
                success: true,
                schedules,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    return app;
}
