# Reuben League

Sports league and results management for Kenyan community tournaments.

**Every game counts. Every table is live.**

The site is built on the structure of the uploaded Stamina template (Free-Template.co). Template CSS values, the Muli
type stack, the red and black palette and the section patterns are reproduced exactly. See
[`docs/TEMPLATE-AUDIT.md`](docs/TEMPLATE-AUDIT.md) for the zip inventory, the CSS custom property audit and the
`@font-face` inventory.

## Stack

- Next.js 16.4.2 (App Router), React 19.2, TypeScript 5.8
- Tailwind CSS v4.1 with tokens in `app/globals.css`
- NextAuth 5 (credentials and optional Google OAuth) with a server side admin role check
- Recharts 2.15 for standings, match statistics and admin trend charts
- GSAP for row and counter animations, Framer Motion for entrance animations, Lenis for smooth scrolling
- Zod validation, reCAPTCHA v3 with a visible v2 fallback, Nodemailer, Vercel KV and Blob adapters

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

`npm run build` and `npm start` for production. The project targets Node 24 (`.nvmrc`); it also runs on Node 22.

### Demo admin

The credentials provider accepts the admin account defined by `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Both are optional
and are not part of the published environment list, so leave them unset to use the fallback account:

```
email: admin@reubenleague.co.ke
password: reuben-admin
```

Set both variables in production. Google sign in appears automatically when `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET` are set.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used by metadata, sitemap and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for the floating button and links (default `254112272061`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key, safe in the browser |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret, server only |
| `NEXTAUTH_SECRET` | NextAuth session encryption |
| `NEXTAUTH_URL` | Deployment URL for NextAuth |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google OAuth |
| `PEXELS_API_KEY` | Reserved for image sourcing |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel KV storage for results, registrations and enquiries |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for future badge uploads |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Confirmation and enquiry email |

Without KV or SMTP configured the app still runs: writes go to a process level store and email sending is logged and
skipped.

## Routes

Pages: `/`, `/leagues`, `/league/[slug]`, `/team/[slug]`, `/match/[id]`, `/admin`, `/admin/leagues/new`,
`/admin/fixtures/add`, `/admin/results/enter`, `/admin/teams/add`, `/admin/players/add`, `/register-tournament`,
`/login`, `/about`, `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, `/500` and the 404 boundary.

API routes: `/api/admin/leagues/create`, `/api/admin/fixtures/add`, `/api/admin/results/enter`,
`/api/admin/teams/add`, `/api/admin/players/add`, `/api/tournaments/register`, `/api/send-enquiry`, plus
`/api/auth/[...nextauth]`.

Every admin route calls `requireAdmin()` before it touches data, then verifies reCAPTCHA and validates the body with
Zod. Standings are never stored separately: they are computed from completed fixtures, so a saved result updates the
table, goal difference, top scorers and team form in one step.

## Data

`lib/data.ts` generates deterministic seed content: seven leagues across five sports, 60 teams, full squads, fixtures,
results, goals, cards and referees. The same PRNG seeds power server and client renders, so charts and tables hydrate
without mismatches.

## Accessibility and responsive notes

- Mobile first layouts, tested markup at 375, 390, 430, 768, 1024, 1280 and 1536 pixels
- Standings, squad and cookie tables scroll horizontally on mobile with a visible scroll hint
- Admin sidebar becomes a hamburger drawer below 1024px, closes on overlay click or Escape
- All touch targets are at least 44 by 44 pixels; form inputs are 16px or larger
- Charts use `ResponsiveContainer` inside fixed height wrappers (`h-48 sm:h-64 lg:h-80`) with 11px axis ticks
- Reduced motion disables the preloader animation, Lenis smoothing, GSAP staggers and Recharts animation stays opt in

## Images and fonts

All photography lives in `public/images/` with credits in [`image-credits.md`](image-credits.md). Muli is self hosted
in `public/fonts/muli/`. Template fonts and photographs are archived in `public/fonts/flaticon`,
`public/fonts/icomoon` and `public/images/template/`.

## Notes on pinned versions

Four dependencies moved to versions that the registry and the security audit require. Everything else matches the
brief exactly, including the `postcss`, `sharp` and `sprintf-js` overrides.

| Package | Brief | Installed | Why |
| --- | --- | --- | --- |
| `@vercel/blob` | 0.29.4 | 2.8.2 | 0.29.4 is no longer published; the package has moved through 1.x and 2.x |
| `nodemailer` | 6.10.1 | 10.1.7 | 6.10.1 carries 3 critical and 1 high advisory; 10.1.7 is the patched release |
| `next-auth` | 5.0.0-beta.28 | 5.0.0-beta.32 | beta.28 pulls a vulnerable `@auth/core`; beta.32 resolves it |
| `jspdf` | 3.0.1 | 4.2.1 | 3.x has a critical DoS advisory; jspdf is installed for future report exports and is not imported yet |

Extra overrides (`motion-dom@12.17.3`, `motion-utils@12.12.1`, `nodemailer@10.1.7` under `next-auth` and
`@auth/core`) keep transitive packages on compatible, patched versions. `@tailwindcss/postcss@4.1.10` and
`@types/qrcode` are added because Tailwind v4 needs its PostCSS plugin and the QR helper needs types.

`npm run lint` is kept as `next lint` to match the brief, but Next.js 16 removed that command, so it exits with
"Invalid project directory". Use `npm run typecheck` (`tsc --noEmit`) for the working static check.
