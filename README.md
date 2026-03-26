# 🌱 Belgian Garden Planner

A web app to plan your Belgian garden — know what to plant, when, and with what.

**Stack:** Next.js 14 · Supabase · Tailwind CSS · Netlify

---

## Deploy your site (no experience needed — 3 steps)

Your Netlify site is already created and configured at:
👉 **https://belgian-garden-planner.netlify.app**

You just need to upload the code to GitHub and connect it to Netlify.

---

### Step 1 — Create a GitHub account & repository

1. Go to https://github.com and create a free account (or log in)
2. Click **New repository**, name it `belgian-garden-planner`, set it to **Public**, click **Create repository**
3. On the next screen, click **uploading an existing file**
4. Open the `belgian-garden-app` folder on your computer, select **all files**, and drag them into GitHub
5. Scroll down and click **Commit changes**

> ⚠️ Do NOT upload `.env.local` — it contains secret keys. The `.gitignore` file already excludes it.

---

### Step 2 — Connect GitHub to your Netlify site

1. Go to https://app.netlify.com/projects/belgian-garden-planner
2. Click **Link to Git provider** (or go to **Site configuration → Build & deploy → Continuous deployment**)
3. Choose **GitHub**, authorise Netlify, and select your `belgian-garden-planner` repository
4. For the build settings, confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Click **Deploy site**

Netlify will build and publish your site automatically. It takes 2–3 minutes.
Your live URL: **https://belgian-garden-planner.netlify.app**

---

### Step 3 — After deploying (environment variables are already set ✅)

The Supabase database credentials are already configured in Netlify — you don't need to add them manually.

Every time you push changes to GitHub, Netlify will automatically rebuild and redeploy your site.

---

## Run locally (optional, for development)

```bash
# 1. Install Node.js from https://nodejs.org (LTS version)
# 2. Open a terminal in the project folder and run:

npm install

# 3. The .env.local file already contains your Supabase credentials.
# 4. Start the development server:
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## Project structure

```
belgian-garden-planner/
├── app/
│   ├── layout.tsx          ← Navigation, header, footer (wraps all pages)
│   ├── page.tsx            ← Home page: plant grid with filters
│   ├── globals.css         ← Global styles
│   ├── plants/
│   │   └── [slug]/
│   │       └── page.tsx    ← Individual plant page (calendar + companions)
│   └── planner/
│       └── page.tsx        ← Monthly planner (pick a month → choose plants)
├── components/
│   └── PlantGrid.tsx       ← Plant cards with search + filter by type/location
├── lib/
│   └── supabase.ts         ← All database queries in one place
├── types/
│   └── index.ts            ← TypeScript types + label/colour constants
├── seed.sql                ← Database schema + 127 plants (already loaded ✅)
├── netlify.toml            ← Netlify build configuration
├── .env.local              ← Your Supabase credentials (DO NOT commit to GitHub)
├── .env.example            ← Template for credentials (safe to commit)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Features

- **Home page** — browse all 127 plants with filters by type (vegetable/fruit/herb/flower) and location (outdoor/greenhouse), plus search
- **Plant detail page** — photo, description, variety info, visual month-by-month calendar, companion planting guide, and growing tips
- **Monthly Planner** — select any month, see what you can plant/sow/harvest, click plants to build your personal plan for that month

---

## Adding more plants

You can add plants directly in Supabase:

1. Go to **Table Editor** in Supabase → https://supabase.com/dashboard/project/cnizbdhdkxwjapgdoveh
2. Open the `plants` table → click **Insert row**
3. Fill in the fields (at minimum: `name_en`, `slug`, `type`)
4. Add calendar entries in `planting_calendar` for the new plant
5. Add companion relationships in `companions` if relevant

---

## Colour legend (calendar bars)

| Colour | Activity |
|---|---|
| 🔵 Blue | Sow indoors |
| 🟡 Yellow | Transplant outdoors |
| 🟢 Green | Sow outdoors directly |
| 🟠 Orange | Harvest |
