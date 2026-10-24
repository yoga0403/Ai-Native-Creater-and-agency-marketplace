# Deployment

## Deploy the complete website on Render

The Render web service serves both the built Vite frontend and the Express API from one origin. The root [`render.yaml`](./render.yaml) builds the frontend and starts the backend; the backend serves the frontend build and handles `/api/*` requests.

1. Push the repository to GitHub and connect it to Render.
2. Create or update a Render Blueprint using `render.yaml`.
3. For an existing manually configured service, open **Settings → Build & Deploy** and set:
   - **Root Directory:** blank (repository root)
   - **Build Command:** `npm ci --prefix backend && npm ci --prefix frontend && npm run build --prefix frontend`
   - **Start Command:** `npm start --prefix backend`
4. Set `NODE_VERSION` to `22.12.0` and `NODE_ENV` to `production` in the Render environment settings.
5. Deploy. Open the service URL to load the website and check `/api/health` for the API health response.

No `VITE_API_BASE_URL` is needed for this single-origin deployment: production requests use `/api` on the same Render service. Videos are served by the backend's `/videos` route.

## Optional separate Vercel frontend

To deploy the frontend separately, import the repository into Vercel, set its **Root Directory** to `frontend`, build command to `npm run build`, and output directory to `dist`. Set `VITE_API_BASE_URL` to the Render URL ending in `/api`, then redeploy. Set Render's `FRONTEND_URL` to the Vercel production origin. The Vercel SPA fallback is configured in [`frontend/vercel.json`](./frontend/vercel.json).

## Environment and persistence

Copy `.env.example` to `.env` for local backend settings. Keep server-only keys out of frontend variables and never commit `.env`.

The current API uses in-memory demo accounts, collaborations, and messages, while the browser stores other demo data in local storage. API data can reset when the Render service restarts or scales, and browser-local data is not shared between users or devices. The existing Supabase helpers are not yet wired into these API routes. Treat this as a demo until authentication and API data are connected to persistent storage.
