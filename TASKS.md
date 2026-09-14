# Malangeni Hub — Frontend Tasks

## Done

### Posts
- Community composer saves posts to the backend.
- Posts have a title, details, tag (Discussion, News, Notice, Job) and optional group.
- News, Notice and Job posts show on the home feed under their filter.
- Optional post picture, resized on the phone and uploaded to Cloudinary.
- Jobs filter on the home feed with a "Job" badge.
- Likes, and delete for the author or staff, on real posts.

### Accounts
- Google sign-in with Firebase (`/login`).
- Every API call sends the Firebase token; a 401 signs the member out.
- Backend account is created automatically on first sign-in.
- First-sign-in onboarding (`/welcome`): member, informal business or registered business.
- Profile page (`/profile`): picture and business badge request.
- Public profiles (`/u/<username>`): avatar, badges, join date and posts. No email. Members only.
- Shared `Avatar`: uploaded picture → Google photo → initials.
- `/profile` sends signed-out visitors to `/login`.

### Badges
- Gold "Hub team" badge for admins and moderators.
- Blue "Local business" badge for business owners.

### Hub team tools (`/staff`)
- Business verification queue: approve or reject with a note.
- Verification log: who verified whom.
- Team list: admins add or remove moderators.
- Revoke business badge (takes the listing down) or staff badge (admins only).
- Members see why a badge was removed and can ask again.
- Groups: create, edit and delete (staff also get edit and delete on the group page).
- Events: approve, needs changes (with note), delete, create.
- Services: approve, needs changes (with note), delete, create.
- Directory listings: approve or hide.
- Library: edit name, about, location, map link and opening hours.

### Community
- Real groups with join and leave (mock groups if none exist).
- Group pages (`/community/groups/[id]`) with members and posts.

### Events
- Event list (`/events`) and event pages (`/events/[id]`).
- Members submit events (`/events/new`); they wait for approval.
- Form checks title, future date and time, location, SA cellphone and description.
- Dates typed as dd/mm/yyyy.
- "Your events": status, staff note, edit and cancel.
- Event pages show the picture and a tap-to-call number.
- Past events are hidden and deleted automatically.

### Services
- Members offer services (`/services/new`): name, category, description, SA cellphone, area, optional hours and picture.
- "Your services": status, note, edit and remove.
- Searchable "Local services" directory with a category filter.
- Malangeni Library card: about, location, directions link, opening hours and open-now. Loaded from the backend.

### Local businesses
- Business listing on `/profile` for confirmed businesses: create, edit, hide.
- "Local businesses" on Explore: hours with open-now, phone, email and location.

### Layout & UI
- Light and dark mode with an animated sun/moon toggle in the header.
- Theme follows the device and remembers the member's choice.
- Mobile nav as an icon dropdown menu.
- Notification bell with inbox and per-category settings.
- Avatars use `next/image` (Google and Firebase hosts allowed).

## To do

### Posts
- [ ] "Create post" button in the header, usable from any page.
- [ ] Edit own posts.
- [ ] Loading and error states for create, edit and delete.

### Accounts
- [ ] Bio field on profiles.
- [ ] Comment from a profile's post list.
- [ ] Delete account (backend ready: `DELETE /api/users/{ownId}`).
- [ ] One shared route guard instead of one per page.
- [ ] Shared "no permission" (403) screen.

### Community
- [ ] Save likes and comments on the home feed and mock threads.
- [ ] Post detail page (`/community/[id]`) with comments.
- [ ] Working Share button.

### Explore & services
- [ ] Place detail pages (`/explore/[id]`).
- [ ] Text search on Explore and a global search in the header.

### Events
- [ ] Add to calendar (.ics).

### Data
- [ ] Replace mock data in `src/lib/data.ts` with API calls.
- [ ] Loading, empty and error states on every list.
- [ ] Pagination or infinite scroll on feeds.

### Quality
- [ ] `next/image` for `PlaceCard`, `FeaturedPlace` and `CommunityFeed`.
- [ ] Page titles and descriptions on `/`, `/explore`, `/community`, `/services` and `/login` (every other route has them).
- [ ] Accessibility pass: focus traps, focus styles, ARIA roles, contrast.
- [ ] Tests: composer, feed filters, auth guard, notification settings.
- [ ] Error boundary and a custom not-found page.

### Waiting on the backend
- [ ] `GET /api/posts?authorId=` (profile posts are filtered in the browser now).
- [ ] `bio` field on `User`.
