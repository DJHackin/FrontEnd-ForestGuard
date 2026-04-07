import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// The path should match the one in drizzle.config.ts
const sqlite = new Database("./database.db");

export const db = drizzle(sqlite, { schema });
