import express from "express";
import { supervisorAgent } from "../agents/supervisor.agent.js";
import { listTasks } from "../services/task.service.js";
import { listNotes } from "../services/notes.service.js";
import { listCalendarEventsViaMcp } from "../services/calendarMcp.service.js";

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

    app.get("/tasks", (_req, res) => {
        res.json({
            success: true,
            tasks: listTasks(),
        });
    });

    app.get("/notes", (_req, res) => {
        res.json({
            success: true,
            notes: listNotes(),
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
