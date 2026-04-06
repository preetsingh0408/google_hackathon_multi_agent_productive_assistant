import { createAgent } from "langchain";
import { model } from "../model.js";
import {
    createTaskTool,
    listTasksTool,
    updateTaskTool,
    deleteTaskTool,
} from "../tools/task.tool.js";

const TASK_AGENT_PROMPT = `
You are a task management assistant.

You can:
- create tasks
- list tasks
- update tasks
- delete tasks

Rules:
- Use create_task when user wants to create a task
- Use list_tasks when user asks to view tasks
- Use update_task when user wants to modify or mark a task
- Use delete_task when user wants to remove a task

LINKING RULES:
- If the request includes calendar_event_id, include it in the create_task or update_task tool call exactly.
- Do not drop calendar_event_id if it is present.
- If calendar_event_id is not present, leave it null/undefined.

Response Rules:
- Be concise and direct
- Confirm only the final action/result
`.trim();

export const taskAgent = createAgent({
    model,
    tools: [createTaskTool, listTasksTool, updateTaskTool, deleteTaskTool],
    systemPrompt: TASK_AGENT_PROMPT,
});
