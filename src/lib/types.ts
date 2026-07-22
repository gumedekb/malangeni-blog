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
  /** Distance from the user in km (backend-computed). */
  distanceKm?: number;
  /** Average rating out of 5. */
  rating?: number;
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

export type ServiceStatus = "open" | "busy";

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: ServiceStatus;
  statusLabel: string;
  actionLabel: string;
  /** Rendered as the dark, highlighted "primary" card. */
  primary?: boolean;
  badge?: string;
}

export interface OpeningHour {
  label: string;
  value: string;
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
