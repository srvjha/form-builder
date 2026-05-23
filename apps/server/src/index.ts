import http from "node:http";
import { app as expressApplication } from "./server";

async function main() {
  try {
    const server = http.createServer(expressApplication);
    const PORT: number = Number(process.env.PORT) || 8000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
