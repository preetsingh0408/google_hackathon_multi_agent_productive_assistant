import { createAgent } from "langchain";
import { model } from "../model.js";
import {
    createTaskTool,
    listTasksTool,
    updateTaskStatusTool,
} from "../tools/task.tool.js";

const TASK_AGENT_PROMPT = `
You are a task management assistant.

Your responsibilities:
- create tasks
- list tasks
- update task status

Rules:
- use create_task for creation requests
- use list_tasks for fetch/list requests
- use update_task_status for status changes
- always return a concise confirmation
`.trim();

export const taskAgent = createAgent({
    model,
    tools: [createTaskTool, listTasksTool, updateTaskStatusTool],
    systemPrompt: TASK_AGENT_PROMPT,
});
