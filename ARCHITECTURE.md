# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev          # Start local dev server
npm run build        # prisma generate + prisma migrate deploy + next build (runs on Vercel too)
npm run lint         # ESLint
npm run db:seed      # Seed database via prisma/seed.ts

npx prisma migrate dev --name <desc>   # Create + apply a new migration locally
npx prisma migrate deploy              # Apply pending migrations (CI/production)
npx tsc --noEmit                       # Type-check without emitting
```

No test suite is configured.

---

## What this is

**ComplexOne** — a Next.js 14 (App Router) platform for Nigerian students. Three user tracks: `HIGH_SCHOOL`, `UNDERGRAD`, `RESEARCHER`. Every feature is gated behind track/level context stored on the `Profile` model.

---

## Route structure

```
app/
  layout.tsx                  ← Root layout: WaveBackground + Clerk provider + bg-cream body
  (marketing)/                ← Public landing, about, modules pages
  (dashboard)/                ← All authenticated student pages
    layout.tsx                ← getCurrentProfile() + redirect guards; DashboardHeader + BottomNav
    academic/                 ← Courses, CBT practice, AI coach, mastery map
    career/                   ← Career quiz, CV builder, internships, scholarships, admissions
    research/                 ← Citations, proposal drafter, research marketplace, AI assistant
    economy/                  ← Shop (inventory), hostels, checkout, orders
    community/                ← Communities, mentorship
    home/page.tsx
  admin/
    login/page.tsx            ← Outside (gate) group — no layout wrapper
    (gate)/                   ← Protected admin area; own layout with nav bar
      layout.tsx              ← isAdminClerkUser() + isAdminCookieValid(); redirects if either fails
      courses/, questions/, opportunities/, programs/, inventory/, hostels/, orders/, mentors/
  onboarding/page.tsx         ← getOrCreateProfile() → OnboardingForm → /api/onboarding
  sign-in/[[...sign-in]]/     ← Clerk embedded
  sign-up/[[...sign-up]]/
```

---

## Auth layers (two separate systems)

### Student auth — Clerk
`middleware.ts` calls `auth.protect()` on every non-public route. Public routes are explicitly listed (marketing pages, `/api/whatsapp/*`, `/api/paystack/*`, `/api/public/*`).

`lib/profile.ts` provides two helpers used throughout:
- `getCurrentProfile()` — reads by `clerkUserId`; used in dashboard layouts and page data fetches.
- `getOrCreateProfile()` — used only at onboarding and the onboarding API. Creates a fresh profile, or re-links an orphaned profile (deleted Clerk account re-registered with same email) with `onboarded: false`.

### Admin auth — two-factor cookie gate
1. **Clerk email check** (`isAdminClerkUser()` in `lib/admin-auth.ts`): reads `sessionClaims.email` from the Clerk JWT — no DB or API call. Requires the Clerk Dashboard → Sessions → Customize session token to include `{ "email": "{{user.primary_email_address}}" }`. Compares against `ADMIN_EMAIL` env var.
2. **Cookie check** (`isAdminCookieValid()`): validates the `admin_session` httpOnly cookie. Cookie format is `{randomId}.{expiryUnixTimestamp}.{hmac-sha256}`. Sessions expire after 8 hours. HMAC key is `ADMIN_SESSION_SECRET` env var (falls back to `ADMIN_PASSWORD`). Rotating the secret invalidates all active admin sessions.

Non-admin Clerk users hitting `/admin` are silently redirected to `/home` — no admin UI is ever shown. The login page (`/admin/login`) lives outside the `(gate)` route group to avoid redirect loops.

---

## Database — Prisma + Neon PostgreSQL

`lib/prisma.ts` exports a singleton `prisma` client.

**Key model relationships:**
- `Profile` is the central node — nearly every model has a `profileId` FK.
- `Course → Module → Lesson` hierarchy; `Enrollment` and `LessonProgress` track student progress.
- `CoachSession` stores AI chat history as `Json` (array of `{role, content}` message objects), keyed by `context` string (e.g. `"lesson:<lessonId>"`).
- `CbtSession` records exam practice attempts with score/total/answers.
- `Order` covers both inventory purchases and hostel bookings via `itemType: OrderItemType`.
- `WaSession` persists WhatsApp conversation state machine state between webhook calls.

Schema lives in `prisma/schema.prisma`. Migration files live in `prisma/migrations/`.

**Workflow:**
- **Dev**: `npx prisma migrate dev --name <description>` — creates a new migration file and applies it to the local DB.
- **Production**: `prisma migrate deploy` runs automatically as part of `npm run build` (before `next build`). Requires `DIRECT_URL` (not the pooled connection).
- **Never use** `prisma db push` on a DB with real data — it has no rollback and can silently drop columns.

---

## AI — Google Gemini

All AI models are in `lib/gemini.ts`, each a factory function returning a configured `GenerativeModel`:

| Export | Used by | Notes |
|--------|---------|-------|
| `getCoachModel()` | `/api/ai/coach` | General academic coach |
| `getLessonHelperModel()` | `/api/ai/lesson/[id]` | Scoped to specific lesson content |
| `getQuizGeneratorModel()` | `/api/modules/[id]/quiz` | Returns JSON; `responseMimeType: application/json` |
| `getCareerCounsellorModel()` | `/api/career/quiz` | Personalised career narrative |
| `getProposalDraftModel()` | `/api/research/proposal` | Formal academic proposal |
| `getCVBuilderModel()` | `/api/career/cv-builder` | Returns JSON with `summary` + `coverLetter` |
| `getCitationModel()` | `/api/research/citations` | Plain text citation output only |
| `getResearchAssistantModel()` | `/api/ai/research` | Research methodology support |

All AI streaming routes send `text/plain` chunked responses; the `CoachChat` and `LessonAskAI` components read these with a `ReadableStream` reader.

**Important:** `lib/gemini.ts` initialises `new GoogleGenerativeAI(apiKey)` at module level — always guard `GEMINI_API_KEY` in env. The Resend email client in `lib/email.ts` uses a `getResend()` lazy initialiser to avoid build-time crashes when `RESEND_API_KEY` is absent.

---

## Payments — Paystack

`lib/paystack.ts` wraps the Paystack REST API (initialize, verify, webhook signature). Amounts are always in kobo (NGN × 100). Payment flow:

1. `POST /api/payments/initialize` → creates Order record (PENDING) → returns Paystack `authorization_url`
2. Student completes payment on Paystack-hosted page
3. `POST /api/paystack/webhook` (public route) → verifies HMAC signature → updates Order to PAID

---

## File uploads — Vercel Blob

`POST /api/admin/upload` accepts multipart form data (`file` field, PDF only, max 20 MB), uploads to Vercel Blob with `access: "public"`, returns `{ url }`. Requires `BLOB_READ_WRITE_TOKEN` (set automatically when a Blob store is connected in Vercel dashboard).

---

## WhatsApp integration

`/api/whatsapp/marketplace` (public) handles incoming WhatsApp messages via a state machine in `lib/whatsapp-flow.ts`. Session state is persisted in `WaSession` DB records keyed by phone number.

---

## Gamification

`lib/gamification.ts` exports `awardActivity(profileId, points)`. Updates `points`, `currentStreak`, `longestStreak`, and `lastActivityAt` on Profile atomically. Called from lesson completion, CBT sessions, and quiz attempts. Streak logic: same-day activity preserves streak; yesterday extends it; any gap resets to 1.

---

## Background texture

`components/dashboard/WaveBackground.tsx` is rendered once in `app/layout.tsx` as `position: fixed; z-index: 0`. All page content is wrapped in `<div className="relative z-10 min-h-screen">` in the root layout, ensuring the wave sits behind everything globally. Do not add `WaveBackground` to individual layouts — it will duplicate.

---

## Environment variables required

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection (for Prisma migrations) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `GEMINI_API_KEY` | Google Gemini API |
| `ADMIN_EMAIL` | Admin account email (also accepts legacy `ADMIN_EMAILS`) |
| `ADMIN_PASSWORD` | Admin portal password |
| `PAYSTACK_SECRET_KEY` | Paystack payments |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (PDF uploads) |
| `RESEND_API_KEY` | Transactional email (optional — emails silently skipped if absent) |
| `EMAIL_FROM` | Sender address for Resend emails (optional) |

---

## Tailwind brand tokens

Defined in `tailwind.config.ts`:
- `teal`: `#0F2B6B` — primary brand
- `teal-deep`: `#071540`
- `teal-light`: `#1A4DAB`
- `cream`: `#F0F7FF` — background base
- `lime`: `#5BBBFF` — accent

Use `shadow-clay` and `shadow-clay-dark` for card elevation. `text-muted` and `border-border-light` for secondary text and dividers.
