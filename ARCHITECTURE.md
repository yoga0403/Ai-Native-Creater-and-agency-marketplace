# CreatorConnect AI — Architecture & System Design Plan

## 1. Project Overview & Problem Statement

### The Problem
The rapid rise of generative AI tools (Midjourney, Stable Diffusion, ComfyUI, Flux, Runway, ElevenLabs, Claude, Sora) has produced a specialized class of AI creators and prompt engineers. However, traditional freelance marketplaces (Upwork, Fiverr) fail to serve this ecosystem:
1. **No AI-Specific Taxonomy:** Traditional platforms do not capture model checkpoints, LoRAs, ComfyUI workflows, negative prompts, seed reproducibility, or upscale pipelines.
2. **Quality & Consistency Friction:** Brands fear hiring "one-hit-wonder" prompt amateurs who cannot deliver consistent characters, styles, or production-grade resolution across multiple scenes.
3. **Mismatched Briefing Process:** Standard creative briefs don't capture AI-specific requirements (aspect ratios, reference images, tool constraints, commercial IP clearance, deliverable raw asset formats).

### The Solution
**CreatorConnect AI** is a specialized two-sided marketplace tailored specifically for AI-native creative collaboration:
- **AI-Native Portfolios:** Creators showcase deliverables alongside prompt "receipts", model workflows, style tags, and seed parameters.
- **Intelligent Briefing & Matching:** Brands post briefs guided by an AI assistant, matching them directly to creators with proven experience in specific model ecosystems.
- **Iterative Milestone Delivery:** A project room built for versioned prompt variations, image/video review, and feedback loops.

---

## 2. User Roles & Capabilities

| Role | Core Objective | Primary Capabilities |
| :--- | :--- | :--- |
| **Creator** | Monetize AI craftsmanship & build reputation | • Create profile with verified AI tool tags (e.g., Midjourney, ComfyUI, Flux, Runway).<br>• Publish portfolio items with metadata (Prompts, Model/LoRA, Seed, Tools).<br>• Discover briefs filtered by style, tool, and budget.<br>• Submit detailed proposals with milestone breakdowns and iteration limits.<br>• Upload deliverables and manage revision requests. |
| **Brand / Agency** | Commission on-brand AI visual/audio assets | • Post creative briefs with target aesthetics, deliverables, and deadlines.<br>• Use AI Brief Co-Pilot to refine vague requirements into production-ready specs.<br>• Search and filter creators by aesthetic style, specific tool stacks, and ratings.<br>• Shortlist applicants, fund milestones, and review project submissions.<br>• Approve deliverables and rate creators. |
| **Administrator** | Governance, safety, and ecosystem health | • Review and moderate briefs, portfolios, and reported content (IP/NSFW compliance).<br>• Manage AI tool and category taxonomy (adding emerging models).<br>• Mediate disputes over milestones and deliverables.<br>• Monitor platform metrics (active contracts, volume, user growth). |

---

## 3. Feature Breakdown: Core vs. Optional (Bonus)

### Core Requirements (Essential for MVP Prototype)
1. **Authentication & Role Selection:** Sign up as Creator or Brand; manage basic profile details.
2. **Creator Portfolio Engine:** Upload images/videos/audio with structured AI metadata (Prompt, Model, Seed, Negative Prompt, Tools).
3. **Brief Posting & Catalog:** Brands publish briefs specifying category, budget, timeline, and tool requirements.
4. **Discovery & Filtering:** Filter creators and briefs by AI tools (Midjourney, Stable Diffusion, Flux, Runway), media types (Image, Video, Voice, 3D), and visual styles (Photorealistic, Anime, Cinematic, 3D Render).
5. **Proposal & Acceptance Workflow:** Creators submit bids; Brands accept or decline proposals to initiate active projects.
6. **Project Workspace & Status Pipeline:** Simple stage tracking (`Pending` → `In Progress` → `Submitted` → `Revision Requested` → `Completed`).
7. **Basic Review & Rating System:** 5-star rating and written review upon project completion.

### Optional Bonus Features (Plug-and-play post-MVP)
1. **AI Brief Co-Pilot:** Conversational assistant that translates natural language brand ideas into structured technical briefs.
2. **Semantic Matchmaker:** Vector embeddings of briefs matched against creator portfolio descriptions using `pgvector`.
3. **Prompt Confidentiality Controls:** Creators can choose to make prompt details public, visible only to paying clients, or fully private.
4. **Automated Escrow Simulation:** Mock or live Stripe integration for milestone payment deposits and releases.
5. **Direct Media Inspection:** Side-by-side prompt iteration comparison and zoom inspector.

---

## 4. Website Page Structure & Navigation Flow

- **Public Routes:**
  - `/`: Hero, value proposition, trending AI creators, sample active briefs.
  - `/creators`: Searchable creator directory with faceted filters.
  - `/creators/:id`: Creator profile, tool badges, portfolio gallery with prompt inspector.
  - `/briefs`: List of open briefs.
  - `/briefs/:id`: Brief details, requirements, proposal submission trigger.
- **Creator Portal:**
  - `/creator/dashboard`: Overview of active pitches, active projects.
  - `/creator/portfolio`: Add and edit showcase media items with AI parameters.
  - `/creator/projects/:id`: Deliverable uploads, milestone progress.
- **Brand Portal:**
  - `/brand/dashboard`: Active briefs, received proposals.
  - `/brand/briefs/new`: Brief creation with optional AI assistant.
  - `/brand/briefs/:id/proposals`: Compare and accept pitches.
  - `/brand/projects/:id`: Deliverable review room and approval sign-off.
- **Admin Portal:**
  - `/admin`: Moderation and taxonomy control.

---

## 5. Technology Stack & Decoupled Architecture

- **Frontend (`/frontend`):** Vite 8 + React 19 + TypeScript + Vanilla CSS Obsidian Studio Theme + Lucide Icons (running on `http://localhost:5173`)
- **Backend (`/backend`):** Node.js + Express REST API (CORS enabled, running on `http://localhost:5000`)
- **AI Integration:** Google Gemini API adapter endpoint for AI Brief Co-Pilot (`POST /api/ai/copilot`)
- **State & Data Store:** Modular in-memory store in `backend/src/index.js` ready for seamless PostgreSQL / Supabase migration.

---

## 6. Development Roadmap

1. **Phase 1: Project Foundation & Layout Shell** (Setup Next.js, Design System, Navbar, Footer, Navigation, Theme)
2. **Phase 2: Creator Directory & AI Portfolio Showcase** (Cards, Filters, Prompt Inspector Modal, Creator Profile)
3. **Phase 3: Brand Brief Board & AI Brief Co-Pilot** (Brief cards, search, multi-step brief creator with AI assistant)
4. **Phase 4: Marketplace Workflow: Proposals to Project Deal Room** (Pitch submission, deal room, milestone reviews)
5. **Phase 5: User Dashboards & Role Switcher** (Creator & Brand portals, stats, deliverable uploads)
6. **Phase 6: Polish, Seed Data & Validation** (Dark theme perfection, sample AI images/prompts, end-to-end testing)
