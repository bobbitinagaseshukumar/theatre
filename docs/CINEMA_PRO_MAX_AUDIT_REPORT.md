# Cinema Pro Max Production Audit Report

Date: 2026-07-19

Scope reviewed: Vite React frontend, Express API, Prisma/PostgreSQL schema, auth, booking, payment, admin routing, accessibility primitives, SEO shell, responsiveness, and verification commands.

## Executive Summary

Cinema Pro Max is a strong premium cinema UI, but several production risks were present in the booking/payment/security layer. I kept the design language intact and applied targeted fixes only where the current implementation needed hardening.

Verified:

- Frontend production build passes.
- Backend TypeScript/Prisma build passes.
- Frontend tests pass: 2 files, 9 tests.
- Frontend lint passes with pre-existing warnings only.

Not applicable:

- Next.js-specific checks such as App Router, `loading.tsx`, `error.tsx`, ISR, and `next/image` are not applicable because this project is Vite React, not Next.js.

## Fixed Issues

### 1. Default SEO Metadata

Problem: `frontend/index.html` used the default title `frontend` and had no description, Open Graph, Twitter card, theme color, or robots metadata.

Why it is wrong: Search crawlers and social previews had no production-quality page identity.

Impact: Weak SEO, poor share previews, lower perceived trust.

Severity: High.

Exact code fix: Updated `frontend/index.html` with production title, description, robots, theme color, Open Graph, and Twitter metadata.

Better implementation: Add route-level metadata management if the app later adopts SSR or Next.js.

Best practice: Every public page should expose unique title, description, canonical URL, and structured data.

### 2. Missing 404 Experience

Problem: Unknown routes silently redirected to `/`.

Why it is wrong: Users lose context, crawlers see misleading navigation, and broken links are harder to diagnose.

Impact: Confusing UX and poor SEO diagnostics.

Severity: Medium.

Exact code fix: Added `frontend/src/pages/NotFound.tsx` and changed the wildcard route in `frontend/src/App.tsx` to render it.

Better implementation: Track 404 events in analytics.

Best practice: Render a useful 404 page with clear recovery actions.

### 3. Missing App Error Boundary

Problem: A render exception could blank the whole application.

Why it is wrong: Premium apps need graceful recovery for unexpected UI states.

Impact: Users could lose an active booking flow with no recovery path.

Severity: High.

Exact code fix: Added `frontend/src/components/ErrorBoundary.tsx` and wrapped the app shell in `frontend/src/App.tsx`.

Better implementation: Report caught errors to observability tooling.

Best practice: Use route or app-level error boundaries around lazy-loaded surfaces.

### 4. Mobile Navigation Was Incomplete

Problem: Primary nav links were hidden below `lg`, and the search bar was hidden below `md` with no replacement.

Why it is wrong: Mobile users could not reach core flows efficiently.

Impact: Broken mobile UX for movies, offers, food, theatres, and contact.

Severity: High.

Exact code fix: Added a responsive mobile menu, mobile search, route-close behavior, and ARIA expanded states in `frontend/src/components/Navbar.tsx`.

Better implementation: Add a focus trap if the mobile menu evolves into a full drawer.

Best practice: Never hide primary navigation without an equivalent accessible mobile path.

### 5. Search Accessibility

Problem: Search had autocomplete UI but no search role, ARIA linkage, or submit path.

Why it is wrong: Screen readers could not understand the suggestion list, and keyboard users had a weaker flow.

Impact: Accessibility and discoverability problems.

Severity: Medium.

Exact code fix: Updated `frontend/src/components/SearchBar.tsx` with `role="search"`, combobox-style ARIA attributes, listbox/option roles, and query-submit navigation.

Better implementation: Add arrow-key active-descendant navigation.

Best practice: Autocomplete should expose label, expanded state, listbox ownership, and keyboard navigation.

### 6. Seat Map Was Pointer-Only

Problem: Seat SVGs were clickable graphics, not semantic controls.

Why it is wrong: Keyboard and screen-reader users could not reliably select seats.

Impact: WCAG keyboard access failure in the most important booking step.

Severity: Critical.

Exact code fix: Converted seat artwork into real buttons with `aria-label`, `aria-pressed`, disabled states, and 44px touch targets in `frontend/src/pages/Booking.tsx`.

Better implementation: Add row/section summaries and arrow-key grid navigation.

Best practice: Interactive graphics must be backed by semantic controls.

### 7. Checkout Sent Display Seat Numbers Instead Of Seat IDs

Problem: Payment checkout sent `A1` while backend booking logic expected `A-1`.

Why it is wrong: Frontend and backend disagreed about canonical seat identity.

Impact: Seat locks and records could drift or create malformed seats.

Severity: High.

Exact code fix: `frontend/src/pages/Payment.tsx` now sends selected seat IDs, and `backend/src/routes/booking.ts` also tolerates both `A1` and `A-1`.

Better implementation: Share a typed seat identity contract between frontend and backend.

Best practice: Use one canonical ID format across UI, API, and database.

### 8. Booking Did Not Lock Seats

Problem: The booking API created a pending booking after checking seats but did not lock those seats.

Why it is wrong: Concurrent users could proceed against the same seats.

Impact: Duplicate booking risk and payment-time conflicts.

Severity: Critical.

Exact code fix: `backend/src/routes/booking.ts` now normalizes seats, checks booked/active locks, creates the pending booking, and locks `ShowtimeSeat` records with a 10-minute expiry in a transaction.

Better implementation: Add a scheduled cleanup job for expired locks.

Best practice: Booking systems must reserve inventory transactionally before checkout.

### 9. Payment Confirmation Did Not Mark Seats Booked

Problem: Payment success updated the booking status but left showtime seats unlocked/unbooked.

Why it is wrong: Seat inventory did not reflect paid orders.

Impact: Paid seats could appear available to other users.

Severity: Critical.

Exact code fix: Added `confirmBookingPayment` in `backend/src/routes/payment.ts` to confirm bookings, mark locked seats `BOOKED`, clear `lockedUntil`, and create idempotent payment records.

Better implementation: Back payment success with real Razorpay/Stripe webhooks and replay-safe event IDs.

Best practice: Payment capture and inventory confirmation must be atomic and idempotent.

### 10. Payment Ownership And Amount Validation Gaps

Problem: Payment order, refund, mock success, and wallet payment endpoints did not consistently verify booking/payment ownership or exact amount.

Why it is wrong: Users could target another user's booking or create mismatched payment operations.

Impact: Authorization and financial-integrity risk.

Severity: Critical.

Exact code fix: Hardened `backend/src/routes/payment.ts` with ownership checks, amount checks, duplicate prevention, and bounded wallet debit transactions.

Better implementation: Add provider-side order amount verification and webhook signature validation for all providers.

Best practice: Every financial endpoint must verify principal, ownership, amount, state, and idempotency.

### 11. Admin APIs Were Public

Problem: `/api/admin/*` returned operational dashboard data without authentication.

Why it is wrong: Admin analytics and operational data should be role-gated.

Impact: Data exposure and operational security risk.

Severity: Critical.

Exact code fix: Added `protect` and role restriction middleware to `backend/src/routes/admin.ts`.

Better implementation: Add per-module permissions for finance, HR, SOC, CMS, and franchise modules.

Best practice: Admin APIs should default-deny and explicitly grant least privilege.

### 12. Movie Create API Was Public

Problem: `POST /api/movies` allowed unauthenticated movie creation.

Why it is wrong: Public users could mutate production catalogue data.

Impact: Content defacement and data-integrity risk.

Severity: Critical.

Exact code fix: Added auth and elevated role checks in `backend/src/routes/movie.ts`, plus required-field validation.

Better implementation: Add schema validation with a backend validation library.

Best practice: All write APIs need auth, authorization, and input validation.

### 13. Auth Input And Token Helper Issues

Problem: Email values were not normalized consistently, password length was unchecked, and an unused token helper used the wrong JWT option.

Why it is wrong: Duplicate accounts by email case are possible, weak passwords are accepted, and helper reuse would create invalid expiry behavior.

Impact: Account consistency and security risk.

Severity: High.

Exact code fix: Updated `backend/src/controllers/auth.ts` to normalize email, enforce minimum password length, and use `expiresIn`.

Better implementation: Hash OTP values and add account lockout/audit logging.

Best practice: Normalize identifiers, validate credentials, and keep token creation centralized.

### 14. Auth Brute Force Protection

Problem: Auth endpoints shared the global API limiter only.

Why it is wrong: Login/OTP endpoints need stricter throttling than ordinary reads.

Impact: Increased brute-force and OTP abuse risk.

Severity: High.

Exact code fix: Added route-specific auth rate limiting in `backend/src/routes/auth.ts`.

Better implementation: Add user/email-keyed limits and failed-login audit events.

Best practice: Apply tighter limits to authentication and verification endpoints.

### 15. CORS Preview Domain Was Too Broad

Problem: Any `*.vercel.app` origin was allowed.

Why it is wrong: Unowned preview domains could call credentialed APIs.

Impact: Cross-origin trust boundary risk.

Severity: High.

Exact code fix: `backend/src/index.ts` now only allows Vercel previews when `ALLOW_VERCEL_PREVIEWS=true` and handles invalid origins safely.

Better implementation: Explicitly list production and preview frontend URLs in environment variables.

Best practice: Keep credentialed CORS allowlists narrow and environment-controlled.

### 16. API Error Responses Could Leak Detail

Problem: The global error handler exposed raw messages in production.

Why it is wrong: Internal errors can reveal implementation detail.

Impact: Security reconnaissance risk.

Severity: Medium.

Exact code fix: `backend/src/index.ts` now returns generic production errors and detailed errors only outside production.

Better implementation: Add request IDs and structured logging.

Best practice: Separate user-facing errors from operational logs.

### 17. Request Body Size Was Unbounded

Problem: JSON body parsing had no explicit limit.

Why it is wrong: Large bodies can waste memory and degrade service.

Impact: Availability and performance risk.

Severity: Medium.

Exact code fix: `backend/src/index.ts` now uses `express.json({ limit: "1mb" })`.

Better implementation: Use route-specific limits for uploads and JSON endpoints.

Best practice: Set explicit body limits on public APIs.

### 18. Missing PostgreSQL Indexes For Hot Paths

Problem: OTP verification, showtime lookup, booking history, payment history, and seat locks lacked supporting indexes.

Why it is wrong: Production traffic would force avoidable scans.

Impact: Higher latency and worse database load.

Severity: High.

Exact code fix: Added Prisma indexes in `backend/prisma/schema.prisma` for OTP, Showtime, ShowtimeSeat, Booking, and Payment.

Better implementation: Generate and run a migration, then review query plans with real data.

Best practice: Index common filters, joins, and ordering columns used by high-traffic flows.

### 19. Global Touch Targets And Media Sizing

Problem: Several icon controls and SVG controls had small targets and media lacked a global max-width safeguard.

Why it is wrong: Small targets are hard on mobile, and unconstrained media can cause overflow.

Impact: Mobile usability and responsiveness issues.

Severity: Medium.

Exact code fix: Added global touch-target and media constraints in `frontend/src/index.css`.

Better implementation: Audit every compact admin table action and tune density per viewport.

Best practice: Maintain minimum 44px interactive targets for touch interfaces.

### 20. Frontend Lint Noise In Touched Code

Problem: Touched files had unused catch parameters and a terse unused expression.

Why it is wrong: Warnings hide future regressions.

Impact: Lower signal in CI.

Severity: Low.

Exact code fix: Removed unused catch parameters in touched files and made wishlist toggling explicit in `frontend/src/pages/Movies.tsx`.

Better implementation: Clear the remaining pre-existing warnings in `Success`, `Food`, `ShowtimeSelection`, `MovieDetails`, `Membership`, `ParticleBackground`, and `AdminDashboard`.

Best practice: Keep lint output clean so new warnings are meaningful.

## Remaining Recommendations

- Move JWTs from `localStorage` to httpOnly secure cookies with CSRF protection. This is a coordinated frontend/backend auth migration and was not safe to do partially.
- Add backend schema validation across all route modules, not just the patched critical paths.
- Replace mock showtimes/payment/admin data with real database-backed flows where those features are intended to be production.
- Add webhook endpoints for payment providers with replay protection and provider event persistence.
- Add Playwright accessibility and responsive smoke tests for home, movies, booking, payment, success, and admin.
- Split or virtualize the large `AdminDashboard` and `Home` chunks. The build still warns that those chunks exceed 500 kB.
- Add sitemap, robots.txt, canonical URLs, and structured `Movie`/`Event` schema once final public domains are known.
- Run `prisma migrate dev` or generate a production migration for the added indexes before deploying database changes.

## Verification Log

- `npm run build` in `backend`: passed.
- `npm.cmd run build` in `frontend`: passed.
- `npm.cmd run test` in `frontend`: passed, 9 tests.
- `npm.cmd run lint` in `frontend`: passed with pre-existing warnings.
