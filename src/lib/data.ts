/**
 * Static content that isn't stored in the backend (yet): Explore's category
 * chips, the "New members" widget and notifications.
 *
 * Posts, groups, events and places used to live here too; they're now demo
 * data in the database (see the backend's DemoDataService).
 */

import type { AppNotification, Member, NotificationCategory } from "./types";

export const EXPLORE_CATEGORIES = [
  "All",
  "Learning",
  "Health",
  "Recreation",
  "Food",
  "Transport",
] as const;

export const NEW_MEMBERS: Member[] = [
  { initials: "SD", color: "#3f6e8c" },
  { initials: "NK", color: "#d2452f" },
  { initials: "BM", color: "#b8842b" },
  { initials: "LT", color: "#5a7d3f" },
];

export const NEW_MEMBERS_MORE = "+38 this week";


/**
 * Presentation metadata for each notification category. `emoji` is the leading
 * icon, `dot` a Tailwind background class for the small colour dot, and `chip`
 * the pill styling used in the preferences list. Ordered as shown in the UI.
 */
export const NOTIFICATION_CATEGORIES: {
  key: NotificationCategory;
  label: string;
  description: string;
  emoji: string;
  dot: string;
  chip: string;
}[] = [
  {
    key: "jobs",
    label: "Job opportunities",
    description: "Local openings, learnerships and workshops",
    emoji: "💼",
    dot: "bg-gold",
    chip: "bg-tag text-gold",
  },
  {
    key: "events",
    label: "Events",
    description: "What's on around Malangeni",
    emoji: "📅",
    dot: "bg-accent",
    chip: "bg-accent-soft text-accent",
  },
  {
    key: "news",
    label: "News & notices",
    description: "Announcements from the hub",
    emoji: "📰",
    dot: "bg-ink",
    chip: "bg-card text-ink",
  },
  {
    key: "services",
    label: "Service alerts",
    description: "Updates on local services",
    emoji: "🛎️",
    dot: "bg-open",
    chip: "bg-fun-soft text-fun",
  },
  {
    key: "community",
    label: "Community activity",
    description: "Replies, groups and new members",
    emoji: "💬",
    dot: "bg-fun",
    chip: "bg-fun-soft text-fun",
  },
];

/**
 * Latest updates shown in the notification bell, newest first. Swap for a
 * `GET /notifications` call when the backend is ready — the shape already
 * matches AppNotification.
 */
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    category: "jobs",
    title: "Cashier wanted at Corner Market",
    body: "Part-time, weekends. Apply at the front desk by 15 Jul.",
    timeAgo: "1h",
    href: "/explore",
  },
  {
    id: "n2",
    category: "events",
    title: "Community clean-up this Saturday",
    body: "8:00 AM at the Library grounds — gloves and bags provided.",
    timeAgo: "2h",
    href: "/",
  },
  {
    id: "n3",
    category: "jobs",
    title: "Library assistant (3-month contract)",
    body: "Matric required. Applications now open at the desk.",
    timeAgo: "4h",
    href: "/services",
  },
  {
    id: "n6",
    category: "events",
    title: "Open mic night — 15 Jul",
    body: "6:30 PM at the Main hall. Sign up to perform.",
    timeAgo: "1d",
    href: "/",
  },
  {
    id: "n7",
    category: "community",
    title: "Thabo replied to your post",
    body: "“Anyone forming a matric study group?” — 3 new replies.",
    timeAgo: "1d",
    href: "/community",
  },
  {
    id: "n8",
    category: "jobs",
    title: "Free coding workshop at Skills Centre",
    body: "8-week programme starting August. Register to reserve a seat.",
    timeAgo: "2d",
    href: "/explore",
  },
];
