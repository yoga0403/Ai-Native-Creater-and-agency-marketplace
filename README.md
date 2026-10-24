# CreatorConnect AI — Smart Video Advertisement & Creator Marketplace

An intelligent video advertisement and creator connection marketplace where businesses showcase products and services, discover category-compatible video creators, and contact them directly for promotional campaigns.

---

## 🌟 Core Value Proposition

> **"A jewellery shop finds jewellery and fashion creators. A clothing brand finds fashion influencers. A college finds education creators who make college promotional videos. Every business is connected with creators who match its category, audience, budget, and promotional goals."**

---

## 🚀 Key Features Implemented

### 1. Homepage Video Advertisement Feed (`VideoAdFeed.tsx`)
- Scrollable video feed featuring genuine video advertisements and portfolio videos across all 10 business sectors.
- **Independent Video Playback:** Every card plays its own video file with unique React keys, isolated playback state, and no video cross-play bugs.
- **Audio Safety:** Muted by default so sound never autoplays unexpectedly; interactive audio unmute toggle.
- Category filters, format indicators, duration badges, and direct **View Profile** & **Contact Creator** action buttons.

### 2. 10 Sample Business Categories with Tailored Creators
1. **Jewellery & Accessories:** Gold temple jewellery, diamond chokers, solitaires, and luxury timepiece macro reels.
2. **Clothing & Fashion:** Saree draping reels, bridal lehengas, festive boutique lookbooks, and runway sequences.
3. **Colleges & Education:** Campus tours, student-life vlogs, modern robotics lab walkthroughs, and 2027 admission campaign reels.
4. **Restaurants & Food:** Sizzling charcoal Wagyu grills, woodfired pizza pulls, chef interviews, and dining walkthroughs.
5. **Beauty & Skincare:** Dewy glass skin routines, serum droplet textures, and cosmetic unboxings.
6. **Electronics & Tech:** Gadget unboxings, titanium smartwatch exploded views, and smartphone reviews.
7. **Travel & Tourism:** 4K drone landscape flythroughs, cliffside infinity pools, and luxury resort teasers.
8. **Healthcare & Fitness:** Gym walkthroughs, plant protein supplements, and wellness routines.
9. **Real Estate & Housing:** Luxury villa walkthroughs, sky penthouses, and architectural reels.
10. **Local Businesses & Startups:** Neighborhood sourdough bakeries, boutique studios, and startup founder stories.

### 3. Smart Creator Matching Engine (`api.ts` & Matcher Tab)
- Recommends creators based on:
  - Category compatibility (Direct & High-Affinity cross-sector matching)
  - Content format (Reels, Shorts, Campus Tours, Reviews, Unboxings)
  - Platform compatibility (Instagram, YouTube, TikTok, Facebook)
  - Budget & pricing fit
  - Language & location compatibility
- **Dynamic Reasoning:** Generates transparent explanations such as *"Matches your Jewellery & Accessories category, specializes in macro light caustics, English & Hindi fluency, and within budget."*
- **Integrity & Honesty:** Displays **"Not provided"** when follower counts, rates, or ratings are unavailable—no fabricated metrics.

### 4. Separate Business and Creator Experiences
- **Business / Brand Experience:**
  - View brand profile, logo, location, and uploaded product media.
  - Upload product videos and image references.
  - Create structured advertisement campaigns.
  - View sent collaboration requests with live status pills (**Pending**, **Accepted**, **Rejected**, **Completed**).
  - Open in-platform deal room messages.
- **Creator Experience:**
  - View creator profile, languages, specializations, social links, and rates.
  - Manage portfolio video showcases.
  - Receive incoming collaboration requests from brands with **Accept Deal**, **Decline**, and **Mark as Completed** actions.
  - Exchange direct messages without revealing private phone numbers or emails unless desired.

### 5. Contact Suitable Creators & Collaboration System
- Every creator card includes: Photo, Name, Category, Portfolio Video preview, Social Platforms, Languages/Location, Rates, **View Profile**, and **Contact Creator** / **Send Collaboration Request**.
- `CollaborationModal`: Collects Campaign Title, Product/Service Details, Deliverable Requirements, Budget, Deadline, Message to Creator, and Contact Preference.
- Saves request to persistent store (Supabase / Express backend / LocalStorage) with real status.
- `CollaborationChatModal`: In-platform messaging interface between brand and creator with real-time status transitions.

### 6. Campaign Brief Builder & AI Brief Co-Pilot
- Comprehensive form capturing business name, category, product, campaign description, objective, platform, format, audience, language, location, budget, and deadline.
- **AI Brief Co-Pilot**: Turns simple notes into structured promotional briefs with suggested cameras, prompts, and deliverables.

### 7. Natural Language & Voice Search
- Search bar understands queries like:
  - *"Jewellery video creators"*
  - *"Saree and clothing influencers"*
  - *"College promotion creators"*
  - *"Food reviewers near me"*
  - *"YouTube education creators"*
  - *"Instagram reel makers"*
- Web Speech API voice search button for spoken queries.

---

## 🗄️ Database Schema & Supabase Setup (`supabase_schema.sql`)

A production-ready PostgreSQL / Supabase schema is included in `supabase_schema.sql`:
- `profiles`: User accounts & roles (`brand`, `creator`, `admin`)
- `business_profiles`: Business category, products/services, logo, links
- `creator_profiles`: Specializations, languages, platforms, rates, verified status
- `portfolio_items`: Video streaming URLs, aspect ratios, thumbnails, prompts
- `campaigns`: Advertisement briefs, budgets, deadlines, deliverables
- `collaboration_requests`: Outreach requests with real statuses (`Pending`, `Accepted`, `Rejected`, `Completed`)
- `collaboration_messages`: Private in-platform messaging thread
- Storage buckets: `campaign-media` and `creator-portfolio`
- Complete Row-Level Security (RLS) policies.

---

## 🏃 Running the Project

For separate production deployments on Render (API) and Vercel (frontend), see [DEPLOYMENT.md](./DEPLOYMENT.md).

### 1. Run the Decoupled Frontend (Vite)
```bash
cd frontend
npm run dev
```
Runs at `http://localhost:5173`.

### 2. Run the Express Backend Server
```bash
cd backend
npm run dev
```
Runs at `http://localhost:5000` (serves REST endpoints and HTML5 static video streaming from `/videos`).

---

## 🧪 Validated End-to-End Scenarios

1. **Jewellery Business Promotion:**
   - Business selects *Jewellery & Accessories*.
   - Smart Match recommends *Priya & Dev Sharma* (Macro diamond caustics, 22K gold temple jewellery).
   - Business watches macro solitaire and Kundan polki video reels.
   - Opens creator profile, sends collaboration request for $1,200.
   - Creator receives request, accepts deal, and messages the brand in the in-platform chat.
   - Status transitions from `Pending` → `Accepted`.

2. **Clothing & Boutique Saree Campaign:**
   - Business selects *Clothing & Fashion*.
   - Discovers *Aanya Kapoor & Studio* (Saree draping and bridal lehenga reels).
   - Sends collaboration request for Banarasi silk festive launch.
   - Creator views and accepts deal.

3. **College Admissions Campaign:**
   - Institution selects *Colleges & Education*.
   - Smart Match recommends *Rohan Varma* (Campus tour vlogs & tech admission campaigns).
   - Institution watches cinematic campus drone and robotics lab video.
   - Institution sends collaboration request for $1,500 admissions series.
