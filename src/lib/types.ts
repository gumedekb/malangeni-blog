/**
 * Domain types for the Malangeni Hub frontend.
 *
 * These mirror the entities the Spring Boot backend will expose (see
 * backend-goal.md). The frontend is the spec: every visible piece of data maps
 * to a field here so the mock data in `data.ts` can later be swapped for real
 * API responses without touching the components.
 */

export type Category =
  | "Learning"
  | "Health"
  | "Recreation"
  | "Food"
  | "Transport";

export interface CommunityEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  tag: "important" | "fun" | null;
  /** Detail-page fields; mock events leave them out. */
  description?: string | null;
  dateLabel?: string;
  organiser?: string | null;
  contactNumber?: string | null;
  imageUrl?: string | null;
}

export type FeedType = "news" | "notice" | "job";

export interface FeedPost {
  id: string;
  type: FeedType;
  authorName: string;
  authorInitials: string;
  timeAgo: string;
  title: string;
  body: string;
  /** Background image URL; text-only posts omit this. */
  image?: string;
  /** Taller image tile in the masonry layout. */
  tall?: boolean;
  likes: number;
  comments: number;
}

export interface Place {
  id: string;
  name: string;
  category: Category;
  image: string;
  featured?: boolean;
  description?: string;
}

export interface Thread {
  id: string;
  authorName: string;
  authorInitials: string;
  avatarColor: string;
  timeAgo: string;
  group: string;
  title: string;
  body: string;
  likes: number;
  replies: number;
}

/**
 * A post as the backend returns it from `/api/posts` — distinct from the
 * mock-data `FeedPost` / `Thread` shapes above, which the components still use
 * until the feed is wired to the real API.
 */
export interface ApiPost {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string | null;
    role?: string;
    badge?: string | null;
  };
  type: "COMMUNITY" | "NEWS" | "NOTICE" | "JOB" | "INFORMATIONAL";
  title: string;
  body: string;
  imageUrl?: string | null;
  groupId?: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser?: boolean;
}

/** Spring's `Page<T>` envelope. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface Group {
  id: string;
  icon: string;
  name: string;
  members: number;
}

export interface Member {
  initials: string;
  color: string;
}

/** Malangeni Library details from `/api/library`. Times are "HH:mm:ss"; a null pair means closed. */
export interface LibraryDetails {
  name: string;
  about?: string | null;
  location?: string | null;
  mapsUrl?: string | null;
  weekdayOpen?: string | null;
  weekdayClose?: string | null;
  saturdayOpen?: string | null;
  saturdayClose?: string | null;
  sundayOpen?: string | null;
  sundayClose?: string | null;
  updatedAt?: string | null;
}

/**
 * Notification categories a member can opt in/out of. Each maps to a source of
 * updates on the hub (job openings, events, news, service alerts, community
 * activity). Preferences are stored per-category — see NotificationsContext.
 */
export type NotificationCategory =
  | "jobs"
  | "events"
  | "news"
  | "services"
  | "community";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /** Human-friendly relative time, e.g. "2h", "1d". */
  timeAgo: string;
  /** Where tapping the notification takes the member. */
  href: string;
}

/** A community group as the backend returns it. */
export interface ApiGroup {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  memberCount?: number;
  /** Only present when the request was signed in. */
  joinedByCurrentUser?: boolean;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  userId: string;
  user?: { id: string; username: string; avatarUrl?: string | null; role?: string; badge?: string | null };
  joinedAt: string;
}

/** An event as the backend returns it (`startAt` is local time, no zone). */
export interface ApiEvent {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  startAt: string;
  tag: "IMPORTANT" | "FUN";
  organiserId?: string | null;
  status?: EventStatus;
  /** SA cellphone number — public on purpose, so people can ask for details. */
  contactNumber?: string | null;
  imageUrl?: string | null;
  /** The hub team's note to the organiser (what to change, or how it was checked). */
  reviewNote?: string | null;
  reviewedBy?: { id: string; username: string } | null;
  reviewedAt?: string | null;
  createdAt?: string;
  organiser?: { id: string; username: string } | null;
}

/**
 * A local business directory listing. Information only — the hub is not a shop
 * builder: no products, no ordering, no per-shop website.
 */
export interface Shop {
  id: string;
  ownerId: string;
  owner?: { id: string; username: string; avatarUrl?: string | null; badge?: string | null };
  name: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  /** "HH:mm:ss" from the backend. */
  openingTime?: string | null;
  closingTime?: string | null;
  /** Set by the hub team; unapproved listings are hidden from the public. */
  approved: boolean;
  /** Set by the owner; false hides the listing without deleting it. */
  active: boolean;
  createdAt: string;
}

export interface ShopInput {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  openingTime?: string;
  closingTime?: string;
}

/** Mirrors badge requests: members submit, the hub team approves or sends it back. */
export type EventStatus = "PENDING" | "APPROVED" | "NEEDS_CHANGES";

/** What kind of service a member offers; labels and icons live in `lib/services.ts`. */
export type ServiceCategory =
  | "PLUMBING"
  | "ELECTRICAL"
  | "BUILDING"
  | "MECHANIC"
  | "TRANSPORT"
  | "TUTORING"
  | "HAIR_BEAUTY"
  | "CATERING"
  | "CLEANING"
  | "GARDENING"
  | "CHILDCARE"
  | "IT_REPAIRS"
  | "OTHER";

/**
 * A service a member offers, as the backend returns it. Listed by anyone,
 * approved by the hub team — same states as events.
 */
export interface ApiService {
  id: string;
  name: string;
  serviceCategory: ServiceCategory;
  description?: string | null;
  /** SA cellphone number — public on purpose, so people can book. */
  contactNumber?: string | null;
  areaServed?: string | null;
  operatingHours?: string | null;
  imageUrl?: string | null;
  status?: EventStatus;
  reviewNote?: string | null;
  reviewedBy?: { id: string; username: string } | null;
  reviewedAt?: string | null;
  providerId?: string | null;
  provider?: { id: string; username: string; avatarUrl?: string | null; role?: string; badge?: string | null } | null;
  createdAt?: string;
}

/** A place on Explore, as the backend's `/api/attractions` returns it. */
export interface ApiAttraction {
  id: string;
  name: string;
  description?: string | null;
  location: string;
  imageUrl?: string | null;
  category?: { id: string; name: string } | null;
  averageRating?: number | null;
  ratingCount?: number | null;
}
