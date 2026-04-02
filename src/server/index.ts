import { startServer } from "@/server/app";
import { connectToDatabase } from "@/server/database";

(async () => {
  await connectToDatabase();
  startServer();
})();
