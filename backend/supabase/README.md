# Supabase Setup

The backend uses Supabase Auth and Postgres when all three Supabase values are configured. Without them, it continues using the local SQLite demo database.

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run [`schema.sql`](schema.sql). This creates the profiles, creator, portfolio, brief, and proposal tables, Auth profile trigger, and starter marketplace records.
3. Copy the values from the root [`.env.example`](../../.env.example) into the existing project-root `.env`. Preserve any keys already in that file. Get the URL and keys from **Project Settings > API**.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` private. It is read only by the backend and must never be added to frontend variables or committed.
5. Restart the backend with `npm run backend` from the project root. Its startup message identifies whether Supabase or local SQLite is active.

Supabase Auth email confirmation is controlled by the project's Auth settings. If confirmation is enabled, registration asks the user to confirm their email before signing in.
