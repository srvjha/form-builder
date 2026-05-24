import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "./env";

export const db:NodePgDatabase = drizzle(env.DATABASE_URL);
export * from "drizzle-orm";
export default db;
