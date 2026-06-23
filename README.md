# EstatePredict

A data-driven home valuation SaaS built on Next.js 14, Tailwind CSS, and a
real Multiple Linear Regression model trained on King County, WA home sales.

## What's inside

- **Auth-gated by default.** Every route except the homepage, `/login`, and
  `/signup` requires a session (`middleware.ts` + a server-side check in
  `app/(protected)/layout.tsx`).
- **A real model**, not a mock. `lib/modelCoefficients.ts` holds OLS
  coefficients fit on the exact 10 features used by the UI (bedrooms,
  bathrooms, sqft_living, sqft_lot, floors, waterfront, view, condition,
  yr_built, city). `lib/model.ts` runs the prediction server-side in
  `app/api/predict/route.ts`.
- **In-memory data store** (`lib/db.ts`) so the whole app runs with zero
  external services out of the box. It's written so swapping in Supabase is
  a small, contained change — see below.

## Getting started

```bash
npm install
cp .env.local.example .env.local
# generate a secret: openssl rand -base64 32
npm run dev
```

Visit `http://localhost:3000`. A demo account is seeded automatically:

```
demo@estatepredict.com / demo1234
```

## Moving to Supabase

The in-memory store in `lib/db.ts` resets every time the server restarts —
fine for development, not for production. To persist real users and
predictions:

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the Supabase SQL editor. It creates `users`
   and `predictions` tables with row-level security so each user can only
   read their own predictions.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
4. In `lib/db.ts`, replace each function body with a call to a Supabase
   client (a starter snippet is in the file's header comment). The function
   signatures are already what the rest of the app calls — `getUserByEmail`,
   `createUser`, `verifyPassword`, `savePrediction`, `getPredictionsForUser`
   — so no other file needs to change.

## Deploying to Render

1. Push this repo to GitHub.
2. In Render, create a **Web Service** from the repo.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add the same environment variables from `.env.local` in Render's
   dashboard (Render injects `PORT` automatically — `npm start` already
   reads it).
6. Set `NEXTAUTH_URL` to your live Render URL once you have one.

## Regenerating the model

If you retrain the notebook with different features or data, regenerate
`lib/modelCoefficients.ts` by re-running the regression and exporting
`intercept`, per-feature coefficients, and per-city dummy coefficients in
the same shape already used in that file.

## Project structure

```
app/
  (auth)/login, (auth)/signup       Public auth pages
  (protected)/predictor, dashboard  Session-gated pages
  api/auth, api/signup, api/predict Route handlers
components/
  ui/                Button, Card, Input, Slider
  layout/             Navbar, Footer
  predictor/          Form + result breakdown chart
  dashboard/          Stats, history, market trends chart
lib/
  auth.ts             NextAuth config (Credentials provider)
  db.ts               Mock data layer (swap for Supabase)
  model.ts            Prediction logic
  modelCoefficients.ts Generated regression coefficients
  cities.ts            44 trained-on cities
middleware.ts          Route protection
```
