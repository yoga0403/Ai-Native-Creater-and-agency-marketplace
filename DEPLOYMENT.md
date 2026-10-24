# Deployment

The app is split into a Vite frontend and an Express API. Deploy them as separate services.

## 1. Deploy the API to Render

1. In Render, create a **Blueprint** from this GitHub repository and select `render.yaml`, or create a Node web service manually.
2. For a manual service, set the root directory to `backend`, the build command to `npm ci`, and the start command to `npm start`.
3. Wait for the service to deploy. Check `https://<your-render-service>.onrender.com/api/health`.
4. In the service environment settings, set `FRONTEND_URL` to the exact Vercel production origin (for example, `https://your-site.vercel.app`). Multiple origins can be comma-separated. Vercel preview origins are allowed automatically.

The server listens on Render's `PORT`, and `/api/health` is the configured health check.

## 2. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `frontend` and keep the Vite framework preset.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Add the environment variable `VITE_API_BASE_URL` with the full API path, for example `https://<your-render-service>.onrender.com/api`.
5. Deploy or redeploy after setting the environment variable.

`frontend/vercel.json` configures the SPA fallback. Videos are served from the frontend's own `public/videos` directory.

## Local environment

Copy `.env.example` to `.env` in the repository root for local backend configuration. Do not commit `.env` or put server-only keys in Vercel variables. The API allows localhost origins outside production and Vercel origins in production; set `FRONTEND_URL` for a custom frontend domain.

## Data and production-readiness note

The current API uses in-memory demo accounts, collaborations, and messages, while the browser stores other demo data in local storage. API data is reset when the Render service restarts or scales, and browser-local data is not shared between users or devices. The existing Supabase helper files are not yet wired into these API routes. Treat this deployment as a demo; before using it for real accounts or campaigns, replace the demo authentication and connect the API data routes to a persistent database.
