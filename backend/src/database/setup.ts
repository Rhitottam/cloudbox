import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from './schema'


const sqlite = new Database('cloud_box.db');
const db = drizzle({ client: sqlite, schema });

type DatabaseType = typeof db;
export { db, DatabaseType };