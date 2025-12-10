import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './cloud_box.db', // Path to your SQLite database file
    },
});
