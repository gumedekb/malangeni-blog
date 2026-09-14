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

> **The backend is already done.** `POST /api/posts`, `GET /api/posts`
> (paginated, filterable by `type` and `groupId`), `PUT`/`DELETE /api/posts/{id}`,
> threaded comments via `POST /api/posts/{postId}/comments` (with
> `parentCommentId`) and likes via `/api/posts/{postId}/likes` all exist, and
> `Post` carries `likeCount`, `commentCount` and `likedByCurrentUser`. This
> whole section is now a **frontend-only** gap: the app is still rendering
> `THREADS` and `FEED_POSTS` from `src/lib/data.ts` while a working API sits
> unused. Types for the real shapes are in `src/lib/types.ts` (`ApiPost`,
> `Page<T>`).

### Tasks

- [ ] **Persist posts to the backend.** Wire the composer to `POST /api/posts`
      via `src/lib/api.ts`; on success, insert the returned entity (with real
      id/timestamp) instead of a fabricated local one.
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

- [x] Firebase Google sign-in (`/login`, `SignInPanel`) with `AuthContext`
      tracking `firebaseUser` + the backend `profile` from `GET /api/auth/me`.
      Every call goes through `apiFetch`, which attaches the Firebase ID token.
      There is no registration step — the backend account is created on the
      first authenticated request.
- [~] **Profile pages**: `/profile` (own settings — picture, username, badge
      request) and `/u/<username>` (public — badges and posts) are both done.
      **Still to do:** a bio field, and commenting from the profile's post list.
      Both pages need the backend work in "Add backend feature" below.
- [~] **Account settings**: username is **not** self-editable (backend product
      decision — only admins rename). **Still to do:** delete account (backend
      already allows `DELETE /api/users/{ownId}`). Email is managed by Google.
- [x] **First-sign-in onboarding** (`/welcome`, `OnboardingGate`): member ·
      informal business · registered business. Business answers include the
      business details and go straight to the verification queue.
- [x] **Hub team tools** (`/staff`, linked from the account menus for
      admins/moderators): business verification queue (approve/reject with a
      note) and, for admins, a team list to make/remove moderators.
- [~] **Route protection**: `/profile` redirects signed-out visitors to
      `/login`, and the composer guards posting. **Still to do:** a shared guard
      (layout or hook) instead of repeating the effect per page.
- [ ] **403 handling in the UI**: a shared "you don't have permission" surface
      for `ApiError.isForbidden`, using `profile.role` / `isOwner(profile, …)`
      to hide the action in the first place.
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

- [~] Shop **registration & onboarding** flow (business profile). Business
      *verification* is done (badge requests + `/staff`); opening a shop
      (`POST /api/shops`) has no UI yet.
- [ ] Shop **storefront** view (subdomain-aware) with product/service catalogue.
- [ ] **Product/service management** dashboard for shop owners (CRUD, scoped to
      their shop).
- [ ] **Orders/enquiries** (cart-free v1) and an owner order list.
- [ ] Surface shops in **Explore/Services** alongside library services.
- [~] Role-aware UI (member vs business owner vs admin): staff tools and
      badges done; shop-owner dashboard not started.

## 6. Data & integration

- [ ] **Replace all mock data** in `src/lib/data.ts` with real `fetch` calls /
      server components once endpoints exist (the component prop shapes already
      match the types, by design).
- [ ] Consistent **loading / empty / error** states across every list.
- [ ] Pagination / infinite scroll for feeds.

## 7. Quality, a11y & polish

- [~] **Images**: `images.remotePatterns` is configured (Google photos +
      Firebase Storage) and avatars use `next/image` via the shared `Avatar`
      component. **Still to do:** `PlaceCard`, `FeaturedPlace` and
      `CommunityFeed` still use CSS `background-image` with remote Unsplash
      URLs — move those to `next/image` and add their host to the patterns.
- [~] **Per-page SEO metadata** (`generateMetadata`) — only the root layout and
      `/profile` set title/description. The other five routes still inherit.
- [ ] **Accessibility pass**: focus traps for the menus/dialogs, focus-visible
      styles, aria roles audit, colour-contrast check.
- [ ] **Tests**: component tests for the composer, feed filtering (incl. the new
      Jobs filter), auth guard, and notification preferences.
- [ ] **Error boundary** + a real `not-found` / error page.
- [ ] Optional: **dark mode** support.

---

### Recently completed

- [x] **Firebase Google sign-in** replacing the old backend-JWT flow. Removed
      `/signup`, `AuthForm` and all `localStorage` token handling; every call
      now goes through `apiFetch`, which attaches the Firebase ID token and
      signs out on 401.
- [x] **Profile page** (`/profile`): picture upload (resized in the browser,
      stored in Firebase Storage) and username editing.
- [x] Shared `Avatar` component with a picture → Google photo → initials
      fallback, used in the header, mobile nav and profile.
- [x] **Public member profiles** (`/u/<username>`): avatar, badges, join date
      and their posts. No email, and no role unless it's one worth showing.
      Members-only — signed-out visitors are asked to sign in.
- [x] **Badges** (`UserBadges`): "Hub team" derived from `role`
      (ADMIN and MODERATOR share one badge on purpose) and "Local business" from
      the `badge` field. Plus the **request business badge** form on `/profile`.
- [x] Notification bell with inbox + per-category preferences
      (`NotificationBell`, `NotificationsContext`).
- [x] Mobile navigation as an icon dropdown menu (`MobileNav`).
- [x] **Jobs** filter on the home community feed + `type: "job"` posts with a
      "Job" badge (`CommunityFeed`, `FeedType`).

---

## Add backend feature

**Status (checked against the backend 2026-09-14):**

| § | Item | Status |
| --- | --- | --- |
| 1 | `PATCH /api/auth/me` | **Dropped** — username is admin-only; avatar remove now uses `DELETE /api/users/me/avatar` |
| 2 | Avatar URL on `User` | **Done** — `profileImageUrl`, uploaded through the backend to Cloudinary (not Firebase Storage) |
| 3 | Username validation | N/A — no self-edit |
| 4 | Security of `PUT /api/users/{id}` | **Done** — admin-only, role only via `PUT /{id}/role` |
| 5 | Firebase Storage rules | **Not needed** — Cloudinary |
| 6 | Public projection, no emails | **Done** — `PublicUserSerializer` everywhere + `GET /api/users/profile/{username}` |
| 6 | `GET /api/posts?authorId=` | **Missing** — still filtered client-side |
| 7 | Badge requests | **Done** — `PATCH /users/{id}/badge` replaced by `POST /api/badge-requests/{id}/approve\|reject` |
| — | Post types `JOB` / `INFORMATIONAL` | **Missing** — backend `PostType` only has `COMMUNITY`/`NEWS`/`NOTICE` |
| Later | Delete account / `bio` | Delete exists (`DELETE /api/users/{id}` for self); `bio` missing |

The original requests are kept below for reference.

Work the **backend** needs for frontend features that are already built. The UI
ships and works up to the point of saving; these endpoints are what make the
save succeed. Until then `/profile` loads fine but saving returns 404.

### 1. `PATCH /api/auth/me` — update your own profile

The only endpoint a member may use to change their own record.

```http
PATCH /api/auth/me
Authorization: Bearer <firebase id token>
Content-Type: application/json

{ "username": "thabo.m", "avatarUrl": "https://firebasestorage.../avatars/abc.jpg" }
```

- **Both fields optional** — the frontend sends only what changed. Treat an
  absent key as "leave unchanged".
- **`avatarUrl: null` means remove the picture.** Distinguish JSON `null` from
  an absent key, or the "Remove" button silently does nothing.
- **Response `200`**: the full updated user, same shape as `GET /api/auth/me`
  (`{ id, username, email, role, createdAt, avatarUrl }`). The frontend replaces
  its state with whatever comes back, so return the saved values.

Status codes the UI already handles:

| Code | When | UI behaviour |
| --- | --- | --- |
| `200` | Saved | Shows "Saved.", updates header avatar |
| `400` | Username fails validation | Shows the server's `message` |
| `401` | Token missing/expired | Signs the member out |
| `409` | Username already taken | "That username is already taken." |

### 2. Add `avatarUrl` to the `User` entity

Nullable string (500 chars is plenty). Must be included in the `GET
/api/auth/me` response too — it currently isn't in the schema at all.

The browser uploads the image to **Firebase Storage** and sends the resulting
URL. The backend never receives file bytes and needs no multipart handling or
bucket wiring — it stores a string. (Cloud Run's filesystem is ephemeral, so
accepting uploads directly would have meant wiring Spring to GCS anyway.)

### 3. Username validation — must match the frontend

`src/lib/auth/types.ts` enforces these client-side for instant feedback; the
backend must enforce them for real:

- 3–20 characters
- `[a-zA-Z0-9._-]` only
- **unique, case-insensitively** (`Thabo` must collide with `thabo`) → `409`

### 4. Security — the important one

`PATCH /api/auth/me` must apply changes **only to the user identified by the ID
token**, and must **ignore or reject** `id`, `email`, `role`, `badge`,
`firebaseUid` and `password` if a client sends them.

`badge` is on that list for a reason: if it's settable through the self-update
endpoint, anyone can `curl` themselves a business badge no matter what the UI
offers. Badges are awarded in §7 below, by moderators only.

> ⚠️ The existing `PUT /api/users/{id}` accepts the whole `User` object,
> including `role`. If a member can reach it for their own id, they can make
> themselves `ADMIN`. The frontend deliberately does not call it. Either lock it
> to `ADMIN` callers or drop it.

### 5. Firebase console (not code, but required)

- **Enable Firebase Storage** on the `malangeni-blog` project.
- **Storage rules**: a signed-in user may write only their own avatar, and
  anyone may read:

  ```
  match /avatars/{file} {
    allow read;
    allow write: if request.auth != null
                 && file == request.auth.uid + '.jpg'
                 && request.resource.size < 2 * 1024 * 1024
                 && request.resource.contentType == 'image/jpeg';
  }
  ```

  Without this, uploads fail with `storage/unauthorized` and the UI says the
  rules need fixing.

### 6. Public profiles — stop returning emails

**This is the highest-priority item in this file.**

`Post.author` and `Comment.author` are declared as `$ref: User`, so every post
and comment carries the author's **`email` and `firebaseUid`** — and
`GET /api/posts` is public, no auth required. Right now there are no posts, so
nothing has leaked; it starts leaking the moment somebody posts.

Hiding the email in the UI does **not** fix this. Whatever is in the JSON is one
devtools tab away.

Add a public projection and use it everywhere a user is embedded or returned to
another member:

```json
{ "id": "…", "username": "…", "avatarUrl": "…", "role": "USER", "badge": null }
```

Apply it to `Post.author`, `Comment.author`, `GET /api/users/username/{username}`
and `GET /api/users/{id}`. `email`, `firebaseUid` and `password` must never
appear in any response except the caller's own `GET /api/auth/me`.

Also needed: **`GET /api/posts?authorId={id}`**. The parameter doesn't exist, so
Spring currently ignores it and returns everyone's posts — the profile page
filters the response client-side so it can never show the wrong person's posts,
but that only under-shows; the real filter has to happen server-side. Sorting by
`createdAt,desc` and the existing `Pageable` already work.

### 7. Business badge requests

New endpoint for the request the member submits from `/profile`:

```http
POST /api/badge-requests
Authorization: Bearer <firebase id token>

{
  "businessName":  "Nomsa's Hair Studio",
  "category":      "Hair & beauty",
  "location":      "Next to the clinic, Main Road",
  "contactNumber": "082 123 4567",
  "description":   "Braids, cuts and treatments"
}
```

- `201` created · `409` if the member already has a `PENDING` request.
- Store `status` (`PENDING` / `APPROVED` / `REJECTED`), and on decision record
  **which moderator decided, when, and how they confirmed it**. You'll want that
  audit trail when someone asks who approved a business a year from now.

Then two more pieces:

- **`badgeRequestStatus` on `GET /api/auth/me`** — the member's own latest
  request status, so `/profile` can show "request pending" without another
  endpoint. Own record only; never in the public projection.
- **`PATCH /api/users/{id}/badge`** — admin/moderator only, guarded by the
  caller's role. Sets or clears `badge`. This is the *only* way a badge is ever
  assigned.

**Deliberately not collected:** ID numbers, ID or passport copies, bank details,
proof of address. None of it helps confirm a shop is real, and all of it is
damaging if leaked. Verification is a moderator calling or visiting the
business — in a community this size that's stronger evidence than paperwork, and
it keeps informal traders (spaza shops, salons, taxis) eligible instead of
locking the badge to businesses with formal registration.

If a moderator does look at a licence, they tick "confirmed" — **never store a
copy of the document.**

### Later (not needed yet)

- `DELETE /api/auth/me` for "delete account" — the profile page doesn't offer
  it yet.
- A `bio` field on `User`, for when the profile page grows one.
- More badge types (mayor, councillor, library staff). Held back on purpose:
  every badge is a claim the hub vouches for and has to keep current as people
  leave office, and a stale badge is worse than none. Businesses change hands
  far less often than council seats, so they're the cheapest place to start.
