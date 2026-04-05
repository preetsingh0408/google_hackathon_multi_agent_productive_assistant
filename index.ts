// import express from "express";
// import { supervisorAgent } from "./src/agents/supervisor.agent";

// const app = express();
// app.use(express.json());

// app.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;

//         const result = await supervisorAgent.invoke({
//             messages: [{ role: "user", content: message }],
//         });

//         res.json({
//             success: true,
//             message: result.messages?.at(-1)?.content ?? "",
//             raw: result,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error instanceof Error ? error.message : "Unknown error",
//         });
//     }
// });

// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });

import "dotenv/config";
import { createServer } from "./src/api/server.js";

const port = Number(process.env.PORT || 3000);

const app = createServer();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
