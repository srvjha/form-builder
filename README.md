# FormCraft

> **The form builder that doesn't apologise.**

FormCraft is a production-grade, full-stack form builder built with a brutalist design philosophy — raw, honest, and zero-compromise. No modal-on-modal nightmares, no rounded-corner soup, no dark patterns. You build forms, people fill them, you own the data.

---

## Table of Contents

1. [The Idea](#the-idea)
2. [Design Philosophy](#design-philosophy)
3. [Feature Overview](#feature-overview)
4. [Tech Stack](#tech-stack)
5. [Monorepo Architecture](#monorepo-architecture)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Frontend Routes](#frontend-routes)
9. [Field Types](#field-types)
10. [Starter Templates](#starter-templates)
11. [Form Themes](#form-themes)
12. [Getting Started](#getting-started)
13. [Environment Variables](#environment-variables)
14. [Development Workflow](#development-workflow)
15. [Deployment](#deployment)
16. [Author](#author)

---

## The Idea

Most form builders are either too simple (Google Forms) or over-engineered SaaS products with pricing tiers that lock basic features behind paywalls. FormCraft sits in the middle: a *developer-built* form tool that gives you everything without the noise.

The core loop is three steps:

```
Create → Publish → Collect
```

1. **Create** — drag fields onto a canvas, configure labels, validations, and options.
2. **Publish** — one click. You get a shareable public URL (`/f/your-slug`).
3. **Collect** — responses land in real-time. Export to CSV, view per-field breakdowns, track completion rates and drop-off funnels.

Everything runs on your own infrastructure. No data leaves to a third party (beyond auth via Clerk). You own the Postgres database, the server, the responses — all of it.

---

## Design Philosophy

FormCraft is deliberately **brutalist**:

- **Zero border-radius** — every element is a hard rectangle
- **Offset box-shadows** — `4px 4px 0 #0A0A0A` instead of blurred glows
- **Thick 2px black borders** — structure is visible, not inferred
- **`#FF3B00` accent** — one strong colour, used sparingly
- **No animations for animation's sake** — motion only when it carries meaning

The design system is fully tokenised via CSS custom properties with full **light and dark mode** support, built on Tailwind CSS with a custom brutalist extension. Typography uses three Google Fonts: **Syne** (display/headings), **Inter** (body), and **JetBrains Mono** (code/mono UI).

This is not an aesthetic accident. It is a deliberate statement: clarity over decoration.

---

## Feature Overview

### Builder

- **Drag-and-drop** field reordering via `@dnd-kit`
- **14 field types** (see [Field Types](#field-types))
- **Per-field settings panel** — label, placeholder, help text, required toggle, validations, options
- **Undo / Redo** — 50-step history via Zustand temporal middleware (`zundo`)
- **Auto-save** — form changes debounced and persisted to the database automatically (1.2 s delay)
- **Unsaved / Saving indicator** in the top bar
- **Preview mode** — toggle between builder canvas and full live form preview in one click

### Forms

- **Draft → Published → Closed → Archived** lifecycle with one-click publish/unpublish
- **Public / Unlisted** visibility toggle
- **Collect respondent email** — optional email capture before submission
- **Max responses** cap — form automatically closes when the limit is reached
- **Close date** — scheduled automatic closing at a future datetime
- **Custom success message** or **redirect URL** shown/triggered after submission
- **Shuffle fields** — randomise field display order per session
- **One response per IP** deduplication
- **Require authentication** — Clerk-protected forms (respondents must be signed in)

### Responses

- Paginated response list (20 per page, prev/next controls)
- Per-response detail view with all answers
- **CSV export** — one click downloads all responses with field labels as column headers
- Individual response deletion

### Analytics

- Total **Views** / **Starts** / **Completions** / **Abandons**
- **Completion rate** and **abandonment rate** percentages
- **Median completion time**
- Per-field answer breakdown
- **Time-series chart** — responses over time (Recharts)
- Date-range filtering

### Explore

- Public form gallery — browse all forms marked as `public`

### Themes

- 8 built-in visual themes (Brutalist, Ocean, Midnight, Forest, Solar, Lavender, Monochrome, Coral)
- Live mini-preview on each theme card showing exact colours
- Set as global default — persisted to `localStorage`
- Per-form theme architecture ready in DB (`theme_id` FK on `forms` table)

### Auth & Security

- **Clerk** — email/password + social OAuth, JWT tokens in `Authorization: Bearer` header
- **Auto-provisioning** — on first authenticated tRPC call, user is fetched from Clerk API and upserted into DB (no webhook lag required)
- **Webhook sync** — `user.created` / `user.deleted` events keep DB in sync via Svix-verified Clerk webhooks
- **Rate limiting** — three tiers via `express-rate-limit`:
  - General API: 100 req / 15 min
  - Auth endpoints: 10 req / 15 min
  - Form submissions: 5 req / 10 min per IP
- **Helmet** — security headers (HSTS, referrer policy, COOP)
- **CORS** — strict origin whitelist in production
- **Request IDs** — every request tagged with a UUID, forwarded as `x-request-id`
- **Compression** — gzip on all responses

---

## Tech Stack

### Frontend (`apps/web`)

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.0 |
| Language | TypeScript | 5.9 |
| Styling | Tailwind CSS | 3.x |
| Animation | Framer Motion | 12.x |
| Auth | Clerk (`@clerk/nextjs`) | 7.x |
| API client | tRPC + React Query | 11.x |
| State — global | Zustand | 5.x |
| State — undo/redo | zundo (temporal middleware) | 2.x |
| Drag & drop | @dnd-kit/core, sortable, modifiers | 6/10/9 |
| Charts | Recharts | 3.x |
| UI primitives | Radix UI (11 packages) | latest |
| Icons | Lucide React | 1.x |
| Notifications | Sonner (toasts) | 2.x |
| Command palette | cmdk | 1.x |
| Date utilities | date-fns | 4.x |
| ID generation | nanoid | 5.x |
| Drawer component | vaul | 1.x |
| Fonts | Syne, Inter, JetBrains Mono (Google Fonts) | — |

### Backend (`apps/server`)

| Layer | Library | Version |
|---|---|---|
| Runtime | Node.js | ≥18 |
| Framework | Express | 5.x |
| Language | TypeScript | 5.9 |
| Auth middleware | `@clerk/express` | 2.x |
| API layer | tRPC (Express adapter) | 11.x |
| OpenAPI docs | trpc-to-openapi + Scalar | 3.x |
| Security headers | Helmet | 8.x |
| Rate limiting | express-rate-limit | 8.x |
| Compression | compression | 1.x |
| Logging | morgan + custom logger (`@repo/logger`) | — |
| Email | Resend | 6.x |
| Webhook verification | Svix | 1.x |
| Build | tsup | 8.x |
| Dev runner | tsx watch | 4.x |

### Database & Services

| Layer | Library | Version |
|---|---|---|
| Database | PostgreSQL | 14+ |
| ORM | Drizzle ORM | 0.45 |
| Migrations | drizzle-kit | 0.31 |
| DB client | pg (node-postgres) | 8.x |
| Schema validation | Zod | 4.x |

### Shared Packages

| Package | Purpose |
|---|---|
| `@repo/database` | Drizzle schema, migrations, typed models |
| `@repo/services` | Business logic (Form, Response, Analytics, Theme, User, Auth, Email, Explore) |
| `@repo/trpc` | Shared tRPC router, context, schemas, procedures |
| `@repo/logger` | Structured logger shared across server packages |
| `@repo/ui` | Reserved — shared UI component library |
| `@repo/eslint-config` | Shared ESLint configuration |
| `@repo/typescript-config` | Shared `tsconfig` base |

### Tooling

| Tool | Purpose |
|---|---|
| Turborepo | Monorepo task runner with remote caching |
| pnpm | Fast package manager with workspaces |
| Prettier | Code formatting |
| ESLint | Linting |

---

## Monorepo Architecture

```
form-building/
├── apps/
│   ├── web/                          # Next.js 16 frontend
│   │   ├── app/
│   │   │   ├── (app)/                # Authenticated app shell
│   │   │   │   ├── dashboard/        # Dashboard overview
│   │   │   │   ├── forms/
│   │   │   │   │   ├── page.tsx      # My Forms list
│   │   │   │   │   ├── new/          # Create form + template picker
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── layout.tsx     # Form editor chrome (tabs, header)
│   │   │   │   │       ├── edit/          # Builder canvas (DnD, fields)
│   │   │   │   │       ├── responses/     # Response list + CSV export
│   │   │   │   │       ├── analytics/     # Charts + stats
│   │   │   │   │       ├── share/         # Share link + embed
│   │   │   │   │       └── settings/      # Form-level settings
│   │   │   │   ├── explore/          # Public form gallery
│   │   │   │   ├── themes/           # Theme picker gallery
│   │   │   │   └── settings/         # User settings (profile/appearance/notifications)
│   │   │   ├── (auth)/               # Unauthenticated auth pages
│   │   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── sign-up/[[...sign-up]]/
│   │   │   ├── (marketing)/          # Public marketing pages
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── about/
│   │   │   │   └── characters/       # Mascot / team page
│   │   │   └── f/[slug]/             # Public form submission page
│   │   ├── components/
│   │   │   ├── builder/              # FieldPalette, FieldCard, FieldSettings
│   │   │   ├── form-renderer/        # FieldRenderer (used in builder + /f/[slug])
│   │   │   ├── layout/               # Sidebar, Topbar, AppShell, MarketingNav, MarketingFooter
│   │   │   ├── mascot/               # Brix mascot + MascotScene + animations
│   │   │   ├── shared/               # EmptyState, ThemeToggle
│   │   │   └── ui/                   # 20+ Radix-based design system components
│   │   ├── providers/                # TRPCProvider, ThemeProvider
│   │   ├── stores/                   # Zustand stores: builder, ui, theme, mascot
│   │   ├── lib/
│   │   │   ├── trpc.ts               # createTRPCReact instance
│   │   │   ├── utils.ts              # cn(), buildCsv(), downloadCsv()
│   │   │   └── constants.ts          # ROUTES, FIELD_TYPES, FORM_STATUS_*, API_URL
│   │   └── middleware.ts             # Clerk route protection matcher
│   │
│   └── server/                       # Express API server
│       └── src/
│           ├── server.ts             # App setup: CORS, middleware, tRPC, OpenAPI
│           ├── index.ts              # Entry point — http.listen
│           ├── env.ts                # Zod-validated environment
│           ├── lib/
│           │   ├── api-response.ts   # Typed ApiResponse.ok / .error helpers
│           │   └── api-error.ts      # AppError class
│           ├── middleware/
│           │   ├── security.ts       # Helmet, compression, request ID, logging, rate limits
│           │   └── error-handler.ts  # Global Express error handler
│           └── webhooks/
│               └── clerk.ts          # Svix-verified user.created / user.deleted handler
│
└── packages/
    ├── database/                     # Drizzle ORM
    │   ├── models/                   # user, form, response, analytics, theme
    │   ├── schema.ts                 # Re-exports all models
    │   ├── index.ts                  # db client (pg pool) export
    │   └── drizzle/                  # Generated SQL migration files
    ├── services/                     # Business logic layer
    │   ├── base.ts                   # BaseService (shared error helpers)
    │   ├── user/                     # UserService — upsert, get, delete by clerkId
    │   ├── form/                     # FormService — CRUD, publish, fields, reorder
    │   ├── response/                 # ResponseService — list, get, delete, paginate
    │   ├── analytics/                # AnalyticsService — aggregate stats, time-series
    │   ├── theme/                    # ThemeService — list, get by slug
    │   ├── email/                    # EmailService — Resend transactional email
    │   ├── auth/                     # AuthService
    │   └── explore/                  # ExploreService — public form listing
    ├── trpc/
    │   └── server/
    │       ├── index.ts              # serverRouter + ServerRouter type export
    │       ├── trpc.ts               # publicProcedure + protectedProcedure (with auto-provision)
    │       ├── context.ts            # createBaseContext — userId, requestId, ipAddress
    │       ├── schemas/              # form.schemas.ts — all Zod input/output schemas
    │       └── routes/
    │           ├── health/           # GET /health
    │           ├── auth/             # GET /authentication/me
    │           ├── forms/            # Full CRUD + fields + responses + analytics + export
    │           ├── public/           # Form submission + event tracking (no auth)
    │           ├── explore/          # Public gallery
    │           └── themes/           # Built-in theme presets
    └── logger/                       # Structured logger (Pino or similar)
```

---

## Database Schema

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | Internal UUID |
| `clerk_id` | VARCHAR UNIQUE | Clerk's user ID |
| `email` | VARCHAR UNIQUE NOT NULL | Primary email |
| `full_name` | VARCHAR | Optional display name |
| `profile_image_url` | TEXT | Avatar from Clerk |
| `created_at` / `updated_at` | TIMESTAMP | |

### `themes`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR UNIQUE | Display name |
| `slug` | VARCHAR UNIQUE | URL-safe identifier |
| `description` | TEXT | |
| `category` | VARCHAR | `featured \| minimal \| dark \| warm \| soft` |
| `is_default` | BOOLEAN | |
| `is_active` | BOOLEAN | |
| `colors` | JSONB | `{ primary, background, surface, text, textMuted, accent, border, error }` |
| `fonts` | JSONB | `{ heading, body, mono }` |
| `preview_image_url` | TEXT | |

### `forms`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → users | CASCADE delete |
| `title` | VARCHAR(255) NOT NULL | |
| `description` | TEXT | |
| `slug` | VARCHAR(255) UNIQUE | Auto-generated, used in public URL |
| `status` | ENUM | `draft \| published \| closed \| archived` |
| `visibility` | ENUM | `public \| unlisted` |
| `theme_id` | UUID FK → themes | Nullable; SET NULL on delete |
| `settings` | JSONB | `showProgressBar, shuffleFields, oneResponsePerIp, requireAuth` |
| `max_responses` | INTEGER | `NULL` = unlimited |
| `closes_at` | TIMESTAMP | `NULL` = never closes |
| `collect_email` | BOOLEAN | Prompt respondent for email |
| `success_message` | TEXT | Shown post-submit (default: "Thank you…") |
| `redirect_url` | TEXT | If set, redirect instead of showing success |
| `published_at` | TIMESTAMP | Set on first publish |
| `created_at` / `updated_at` | TIMESTAMP | |

**Indexes:** `user_id`, `slug`, `(status, visibility)`

### `form_fields`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `form_id` | UUID FK → forms | CASCADE delete |
| `type` | ENUM | 14 field types |
| `label` | VARCHAR(500) NOT NULL | |
| `placeholder` | VARCHAR(500) | |
| `help_text` | TEXT | Shown below label |
| `order` | INTEGER | 0-indexed display order |
| `required` | BOOLEAN | |
| `validations` | JSONB | `{ minLength, maxLength, min, max, pattern, patternMessage }` |
| `options` | JSONB | `[{ value, label, imageUrl? }]` — select / multi_select |
| `min_value` / `max_value` | INTEGER | rating max stars; scale range |
| `min_label` / `max_label` | VARCHAR | Endpoint labels for scale |
| `conditional_logic` | JSONB | `{ action, conditions[], logicOperator }` (schema present, UI coming) |

**Indexes:** `form_id`, `(form_id, order)`

### `form_responses`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `form_id` | UUID FK → forms | |
| `respondent_email` | VARCHAR | Populated when `collect_email = true` |
| `ip_address` | VARCHAR(45) | IPv4 + IPv6 |
| `user_agent` | TEXT | |
| `metadata` | JSONB | `{ referer, utmSource, utmMedium, utmCampaign, country }` |
| `completion_time_ms` | INTEGER | Client-measured time to complete |
| `submitted_at` | TIMESTAMP | |

**Indexes:** `form_id`, `submitted_at`, `(ip_address, form_id)`

### `response_answers`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `response_id` | UUID FK → form_responses | CASCADE delete |
| `field_id` | UUID FK → form_fields | CASCADE delete |
| `value` | JSONB | `string \| number \| boolean \| string[] \| null` |
| `created_at` | TIMESTAMP | |

**Indexes:** `response_id`, `field_id`

### `form_analytics`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `form_id` | UUID FK → forms | |
| `event` | ENUM | `view \| start \| submit \| abandon` |
| `session_hash` | VARCHAR(64) | Anonymised session fingerprint |
| `ip_address` | VARCHAR(45) | |
| `country` | VARCHAR(2) | ISO 3166-1 alpha-2 |
| `referrer` | TEXT | |
| `user_agent` | TEXT | |
| `duration_ms` | INTEGER | Time on page before event |
| `properties` | JSONB | Extensible event properties |
| `occurred_at` | TIMESTAMP | |

**Indexes:** `form_id`, `event`, `occurred_at`, `(form_id, event)`

---

## API Reference

The server exposes two parallel API surfaces over the same router:

### tRPC (`/api/trpc/*`)

Type-safe end-to-end, consumed by the Next.js frontend via `@trpc/react-query`. The `ServerRouter` type is shared from `@repo/trpc` — add a procedure on the server and the client gains full autocomplete immediately.

### REST / OpenAPI (`/api/*`)

Auto-generated from the same tRPC router via `trpc-to-openapi`. Interactive docs at **`/docs`** (Scalar UI). Machine-readable spec at **`/openapi.json`**.

### Endpoints

#### Health
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `health.check` | GET | `/health` | None |

#### Auth
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `auth.me` | GET | `/authentication/me` | Required |

#### Forms
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `forms.list` | GET | `/forms` | Required |
| `forms.create` | POST | `/forms` | Required |
| `forms.get` | GET | `/forms/{formId}` | Required |
| `forms.update` | PATCH | `/forms/{formId}` | Required |
| `forms.delete` | DELETE | `/forms/{formId}` | Required |
| `forms.publish` | POST | `/forms/{formId}/publish` | Required |
| `forms.unpublish` | POST | `/forms/{formId}/unpublish` | Required |
| `forms.addField` | POST | `/forms/{formId}/fields` | Required |
| `forms.updateField` | PATCH | `/forms/{formId}/fields/{fieldId}` | Required |
| `forms.deleteField` | DELETE | `/forms/{formId}/fields/{fieldId}` | Required |
| `forms.reorderField` | POST | `/forms/{formId}/fields/reorder` | Required |
| `forms.listResponses` | GET | `/forms/{formId}/responses` | Required |
| `forms.getResponse` | GET | `/forms/{formId}/responses/{responseId}` | Required |
| `forms.deleteResponse` | DELETE | `/forms/{formId}/responses/{responseId}` | Required |
| `forms.exportResponses` | GET | `/forms/{formId}/responses/export` | Required |
| `forms.analytics` | GET | `/forms/{formId}/analytics` | Required |

#### Public (no auth required)
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `public.getForm` | GET | `/public/forms/{slug}` | None |
| `public.submit` | POST | `/public/forms/{slug}/submit` | None |
| `public.trackEvent` | POST | `/public/forms/{slug}/track` | None |

#### Explore
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `explore.listForms` | GET | `/explore` | None |

#### Themes
| Procedure | Method | Path | Auth |
|---|---|---|---|
| `themes.list` | GET | `/themes` | None |
| `themes.get` | GET | `/themes/{slug}` | None |

---

## Frontend Routes

| Route | Description | Auth required |
|---|---|---|
| `/` | Marketing landing page — features, how-it-works, CTA | No |
| `/about` | About page | No |
| `/characters` | Mascot / team page | No |
| `/sign-in` | Clerk sign-in (Syne-styled) | No |
| `/sign-up` | Clerk sign-up | No |
| `/f/[slug]` | **Public form submission** — respondents fill and submit | No |
| `/dashboard` | Overview — stats cards + recent forms | Yes |
| `/forms` | All my forms with status badges and quick actions | Yes |
| `/forms/new` | Create form wizard — template picker + title/description | Yes |
| `/forms/[id]/edit` | **Builder** — drag-and-drop canvas, palette, settings panel | Yes |
| `/forms/[id]/responses` | Response list, pagination, CSV export, delete | Yes |
| `/forms/[id]/analytics` | Analytics — completion rate, time-series, per-field | Yes |
| `/forms/[id]/share` | Share links, embed iframe code | Yes |
| `/forms/[id]/settings` | Form settings — visibility, close date, limits, behaviour | Yes |
| `/explore` | Browse public forms from all users | Yes |
| `/themes` | Theme gallery — preview and set default | Yes |
| `/settings` | User settings — profile, appearance (light/dark), notifications | Yes |

---

## Field Types

FormCraft supports **14 field types**, all rendered identically between the builder canvas preview and the live public form:

| Type | UI | Config options |
|---|---|---|
| `short_text` | Single-line `<input>` | minLength, maxLength, regex pattern |
| `long_text` | Multi-line `<textarea>` with live character count | minLength, maxLength |
| `email` | `<input type="email">` with HTML5 validation | — |
| `number` | `<input type="number">` | min, max |
| `phone` | `<input type="tel">` | — |
| `url` | `<input type="url">` | — |
| `date` | Native date picker | — |
| `time` | Native time picker | — |
| `select` | Brutalist button-list (single choice) | Unlimited options with value + label |
| `multi_select` | Brutalist button-list (multi choice) | Unlimited options with value + label |
| `checkbox` | Single boolean toggle | Custom label text |
| `rating` | Star buttons (configurable 1–N max) | maxValue |
| `scale` | NPS/numeric scale with endpoint labels | minValue, maxValue, minLabel, maxLabel |
| `file_upload` | Drag-and-drop file area | — |

All option-based fields support an optional `imageUrl` per option (rendered when set).

---

## Starter Templates

When creating a new form, pick from **8 templates** that pre-populate the builder with relevant, ready-to-use fields — seeded in parallel immediately after form creation:

### Blank
Empty canvas. Start from scratch.

### Contact Form
> `short_text` Full Name · `email` Email · `short_text` Subject · `long_text` Message

### Feedback Form
> `rating` Overall experience (5★) · `scale` NPS (0–10) · `long_text` What did you enjoy? · `long_text` What could we improve?

### Quick Survey
> `short_text` Name · `select` Age Range · `multi_select` Topics of Interest · `scale` Experience (1–10) · `long_text` Comments

### Job Application
> `short_text` Full Name · `email` Email · `phone` Phone · `url` LinkedIn · `url` Portfolio · `select` Years of Experience (5 bands) · `select` How did you hear about us? · `long_text` Cover Letter

### Event RSVP
> `short_text` Full Name · `email` Email · `select` Attendance (Yes/No/Maybe) · `number` Guest count · `select` Dietary Requirements (6 options) · `long_text` Special Notes

### Bug Report
> `short_text` Bug Title · `select` Severity (Critical/High/Medium/Low) · `long_text` Description · `long_text` Steps to Reproduce · `short_text` Expected Behaviour · `short_text` Actual Behaviour · `short_text` Browser / OS · `email` Reporter Email

### NPS Survey
> `scale` NPS (0–10) · `select` Primary reason for score (5 options) · `long_text` How can we improve? · `short_text` Name · `email` Email

---

## Form Themes

8 built-in visual themes, accessible from the **Themes** page in the sidebar:

| Theme | Accent | Background | Style |
|---|---|---|---|
| **Brutalist** *(default)* | `#FF3B00` | `#F5F0E8` warm cream | Hard borders, 3px offset shadows, zero radius |
| **Ocean** | `#0EA5E9` sky blue | `#F0F9FF` | Soft drop shadows, 8px radius, clean |
| **Midnight** | `#818CF8` indigo | `#0F0F1A` near-black | Dark surfaces, electric accents |
| **Forest** | `#16A34A` green | `#F0FDF4` | Earthy palette, 8px radius |
| **Solar** | `#D97706` amber | `#FFFBEB` warm | Golden tones, 8px radius |
| **Lavender** | `#7C3AED` purple | `#FAF5FF` | Soft violets, 8px radius |
| **Monochrome** | `#171717` black | `#FAFAFA` near-white | Pure black & white, 4px radius |
| **Coral** | `#F43F5E` rose | `#FFF1F2` | Warm pinks, 8px radius |

Each theme card shows a **live mini form preview** rendered with the theme's real hex values. Click **Set as default** to persist to `localStorage:formcraft:defaultTheme`.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (`node -v`)
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- **PostgreSQL** 14+ (local install or hosted)
- A **[Clerk](https://clerk.com)** account (free tier is sufficient)

---

### 1 · Clone the repo

```bash
git clone https://github.com/srvjha/form-building.git
cd form-building
```

### 2 · Install dependencies

```bash
pnpm install
```

### 3 · Create the `.env` file

Create `.env` in the project root (it is symlinked to `apps/web/.env`):

```env
# ── Database ──────────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/formcraft"

# ── Clerk (get from https://dashboard.clerk.com) ──────────────────
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# ── Clerk routing ─────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# ── URLs (local dev) ──────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000
BASE_URL=http://localhost:8000
WEB_URL=http://localhost:3000

# ── Optional ──────────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx     # Email notifications
APP_NAME=FormCraft                 # Overrides default app name
```

### 4 · Set up the database

```bash
# Create the database
createdb formcraft

# Push the Drizzle schema (runs on existing or new DB)
pnpm --filter @repo/database db:push
```

### 5 · Configure Clerk webhooks

In the [Clerk dashboard](https://dashboard.clerk.com) → **Webhooks → Add Endpoint**:

- **URL:** `http://localhost:8000/webhooks/clerk` (use ngrok for local — see below)
- **Events:** `user.created`, `user.deleted`
- Copy the **Signing Secret** → set as `CLERK_WEBHOOK_SECRET` in `.env`

> **Tip:** Even without the webhook, FormCraft auto-provisions users on first sign-in by calling the Clerk API directly — so you can test immediately without ngrok.

### 6 · Start development

```bash
# Starts both servers in parallel via Turborepo
pnpm dev
```

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (Express) | http://localhost:8000 |
| API docs (Scalar) | http://localhost:8000/docs |
| OpenAPI spec | http://localhost:8000/openapi.json |
| Drizzle Studio | `pnpm --filter @repo/database dev` → https://local.drizzle.studio |

---

## Environment Variables

### Web (`apps/web`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend base URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | Sign-in route (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | Sign-up route (`/sign-up`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | ✅ | Post sign-in redirect |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | ✅ | Post sign-up redirect |

### Server (`apps/server`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | ✅ | `sk_…` |
| `CLERK_PUBLISHABLE_KEY` | ✅ | `pk_…` |
| `CLERK_WEBHOOK_SECRET` | ✅ | `whsec_…` — Svix signing secret |
| `BASE_URL` | ✅ | Public URL of the API server |
| `WEB_URL` | ✅ | Public URL of the frontend (CORS origin) |
| `PORT` | — | HTTP port (default: `8000`) |
| `NODE_ENV` | — | `development \| production \| test` |
| `RESEND_API_KEY` | — | For email notifications (`re_…`) |
| `EMAIL_FROM` | — | Sender address (default: `noreply@formbuilder.dev`) |
| `APP_NAME` | — | App name in emails / OpenAPI (default: `FormCraft`) |

---

## Development Workflow

### Commands

```bash
# Start all apps
pnpm dev

# Type-check all packages
pnpm check-types

# Lint everything
pnpm lint

# Format all TypeScript/Markdown files
pnpm format

# ── Database ──────────────────────────────────────────────────────
# Generate a new SQL migration after editing a model
pnpm --filter @repo/database db:generate

# Apply pending migrations
pnpm --filter @repo/database db:migrate

# Push schema without migration file (dev only)
pnpm --filter @repo/database db:push

# Open Drizzle Studio (visual DB browser)
pnpm --filter @repo/database dev
```

### Using ngrok for Clerk webhooks

```bash
# Install: https://ngrok.com/download
ngrok http 8000

# Update .env with the tunnel URL:
NEXT_PUBLIC_API_URL=https://<subdomain>.ngrok-free.app
BASE_URL=https://<subdomain>.ngrok-free.app

# Update the Clerk dashboard webhook endpoint URL to match
```

The tRPC client sends `ngrok-skip-browser-warning: true` automatically to bypass the ngrok interstitial. The CORS config whitelists this header server-side.

### Adding a new field type

1. Add the value to `fieldTypeEnum` in `packages/database/models/form.ts`
2. Add it to `fieldTypeSchema` in `packages/trpc/server/schemas/form.schemas.ts`
3. Add a union member to `FieldType` in `apps/web/stores/builder-store.ts`
4. Add a `case` in `apps/web/components/form-renderer/field-renderer.tsx`
5. Optionally add settings UI in `apps/web/components/builder/field-settings.tsx`
6. Add an entry to `FIELD_TYPES` in `apps/web/lib/constants.ts`

### Adding a new tRPC procedure

1. Add the procedure inside the relevant route file in `packages/trpc/server/routes/`
2. The `ServerRouter` type updates automatically — the frontend has full type inference with zero extra steps

---

## Deployment

### Frontend → Vercel (recommended)

1. Import the repo in Vercel
2. Set **Root Directory** to `apps/web`
3. Set **Framework Preset** to Next.js
4. Add all `NEXT_PUBLIC_*` env vars
5. Deploy

### Backend → Railway / Render / Fly.io

```bash
# Build
pnpm --filter @repo/server build

# Start
pnpm --filter @repo/server start
```

Set all server env vars on the platform. The entry point is `dist/index.js`.

### Database → Neon / Supabase / Railway

Use any managed PostgreSQL provider. Set `DATABASE_URL` in all environments.

```bash
# Run migrations against production
DATABASE_URL=<prod-connection-string> pnpm --filter @repo/database db:migrate
```

---

## Author

**Saurav Jha**

- 𝕏 [@J_srv001](https://x.com/J_srv001)
- GitHub [@srvjha](https://github.com/srvjha)

---

<p align="center">Built with ♥ and no rounded corners.</p>
