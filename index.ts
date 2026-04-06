import "dotenv/config";
import { createServer } from "./src/api/server.js";

const port = Number(process.env.PORT || 3000);

const app = createServer();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
