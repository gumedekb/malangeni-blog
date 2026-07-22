# Malangeni Hub — Frontend / Product TASKS

The concrete, ordered list of work to close the gap between the current app and a
real community platform. This complements `backend-goal.md` (which lists the
backend/API work); this file focuses on the **frontend and full-stack
integration** the "blog" still needs.

Status legend: `[ ]` not started · `[~]` partially done · `[x]` done

---

## 0. Post creation — the headline gap

**Current state (how it works today):**

- The **only** authoring surface is the composer at the top of the Community
  page (`src/components/community/Discussions.tsx`). It is an inline text input
  + "Post" button.
- Mechanism: the input is bound to local `draft` state. On submit, `post()`
  calls `useAuth()`; if the visitor is **not** signed in it redirects to
  `/login`. If signed in and the draft is non-empty, it builds a `Thread`
  object (author name/initials from the logged-in user) and **prepends it to
  local React state** (`setThreads`).
- **Limitations that make this not "real" posting:**
  - It is **not persisted** — no API call. A refresh loses the post.
  - It is **title-only** — no body, no image, no group selection, no tags.
  - It only feeds the Community **Discussions** list. The **home Community feed**
    (news / notices / **jobs**) has **no composer at all** — those posts are
    read-only mock data in `src/lib/data.ts`.
  - No edit, no delete, no draft saving.

### Tasks

- [ ] **Persist posts to the backend.** Wire the composer to `POST /posts`
      (or `/threads`) via `src/lib/api.ts`; on success, insert the returned
      entity (with real id/timestamp) instead of a fabricated local one.
- [ ] **Rich post composer.** Replace the single input with a modal/page that
      supports: title, body, optional image upload, group, and a **type/tag**
      selector (news · notice · **job** · discussion). Reuse the `FeedPost` /
      `Thread` shapes in `src/lib/types.ts`.
- [ ] **Post a job.** Let members create a `type: "job"` post so the new
      **Jobs** filter on the home feed is populated by real users, not just seed
      data.
- [ ] **A global "Create post" entry point** — e.g. a button in the header
      (visible when authenticated) and/or a floating action button, opening the
      composer from anywhere.
- [ ] **Edit / delete own posts** with ownership checks (only the author).
- [ ] **Optimistic UI + error/loading states** for create/edit/delete.

---

## 1. Authentication & accounts

- [~] Login / signup pages exist (`/login`, `/signup`, `AuthForm`) and an
      `AuthContext` with token persistence — but they call a backend that isn't
      wired up yet. **Connect to the real API and handle the full flow.**
- [ ] **Profile page** (`/profile` or `/u/[id]`): avatar, bio, and the user's
      own posts / threads / job listings.
- [ ] **Account settings**: change name/email/password, delete account.
- [ ] **Password reset** ("forgot password") + **email verification**.
- [ ] **Route protection**: redirect unauthenticated users away from
      authenticated-only pages/actions (today only the composer guards this).
- [ ] **Persist notification preferences server-side** (currently localStorage
      only — see `NotificationsContext`).

## 2. Community & social (make interactions real)

- [ ] **Likes/comments are local-only** on both the home feed and Discussions —
      persist them (`POST /posts/{id}/like`, comment endpoints) and reflect real
      counts.
- [ ] **Thread / post detail page** (`/community/[id]`): clicking a post/thread
      currently does nothing — build the detail view with the full body and a
      **comment thread** (read + add replies). "replies" counts are shown but
      not openable today.
- [ ] **Share** action actually shares (Web Share API / copy link) — it's a
      static label now.
- [ ] **Groups**: `GroupsCard` lists groups but join/leave is not wired; add
      real membership + a group page.
- [ ] **"New members" widget** backed by real signup data.
- [ ] **Real notification feed**: the bell (`NotificationBell`) is a client-side
      stub over mock data — back it with real events + read/unread state.

## 3. Explore & Services (wire up the actions)

- [ ] **Booking/reservation actions** on Services do nothing — implement
      book-a-room, sign-up-for-tutoring, hall-hire requests with persisted state
      and conflict handling.
- [ ] **Live availability / "open now"** from real data instead of static dots.
- [ ] **Place detail pages** (`/explore/[id]`): `PlaceCard` and the featured
      place link to `#`. Build the detail view.
- [ ] **Ratings & distances** from the API (currently hardcoded); add the
      ability to rate a place.
- [ ] **Search** across places/services (Explore has category filters; add text
      search) and a **global hub search** in the header.

## 4. Events

- [ ] **Event detail + RSVP** (`EventsList` links to `#`); "See all" events page.
- [ ] Add-to-calendar (.ics) export.

## 5. Shop / marketplace platform (new pillar from `backend-goal.md`)

Entirely absent from the frontend today:

- [ ] Shop **registration & onboarding** flow (business profile).
- [ ] Shop **storefront** view (subdomain-aware) with product/service catalogue.
- [ ] **Product/service management** dashboard for shop owners (CRUD, scoped to
      their shop).
- [ ] **Orders/enquiries** (cart-free v1) and an owner order list.
- [ ] Surface shops in **Explore/Services** alongside library services.
- [ ] Role-aware UI (member vs shop owner vs admin).

## 6. Data & integration

- [ ] **Replace all mock data** in `src/lib/data.ts` with real `fetch` calls /
      server components once endpoints exist (the component prop shapes already
      match the types, by design).
- [ ] Consistent **loading / empty / error** states across every list.
- [ ] Pagination / infinite scroll for feeds.

## 7. Quality, a11y & polish

- [ ] **Images**: feed/place images use CSS `background-image` with remote
      Unsplash URLs — move to `next/image` (or the framework equivalent) for
      optimization, and configure remote patterns.
- [ ] **Per-page SEO metadata** (`generateMetadata`) — only the root layout sets
      title/description today.
- [ ] **Accessibility pass**: focus traps for the menus/dialogs, focus-visible
      styles, aria roles audit, colour-contrast check.
- [ ] **Tests**: component tests for the composer, feed filtering (incl. the new
      Jobs filter), auth guard, and notification preferences.
- [ ] **Error boundary** + a real `not-found` / error page.
- [ ] Optional: **dark mode** support.

---

### Recently completed

- [x] Notification bell with inbox + per-category preferences
      (`NotificationBell`, `NotificationsContext`).
- [x] Mobile navigation as an icon dropdown menu (`MobileNav`).
- [x] **Jobs** filter on the home community feed + `type: "job"` posts with a
      "Job" badge (`CommunityFeed`, `FeedType`).
