/**
 * Mock content mirroring the reference designs in /public/goal.
 *
 * This is the single source the pages read from today. When the backend is
 * ready, replace these constants with `fetch()` calls / server actions — the
 * component props already match these shapes.
 */

import type {
  AppNotification,
  CommunityEvent,
  FeedPost,
  Group,
  Member,
  NotificationCategory,
  OpeningHour,
  Place,
  Service,
  Thread,
} from "./types";

export const CURRENT_USER = {
  name: "You",
  initials: "You",
};

export const FEATURED_PLACE = {
  name: "Malangeni Library",
  eyebrow: "Featured place",
  blurb:
    "The heart of our community — books, study space, and a meeting point for local events. Read more about the place and what's on this week.",
  rating: 4,
  image:
    "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
};

export const EVENTS: CommunityEvent[] = [
  {
    id: "e1",
    day: "12",
    month: "Jul",
    title: "Community clean-up",
    time: "8:00 AM",
    location: "Library grounds",
    tag: "important",
  },
  {
    id: "e2",
    day: "15",
    month: "Jul",
    title: "Open mic night",
    time: "6:30 PM",
    location: "Main hall",
    tag: "fun",
  },
  {
    id: "e3",
    day: "20",
    month: "Jul",
    title: "Kids reading hour",
    time: "10:00 AM",
    location: "Children's wing",
    tag: "fun",
  },
];

export const FEED_POSTS: FeedPost[] = [
  {
    id: "p1",
    type: "news",
    authorName: "Thabo M.",
    authorInitials: "TM",
    timeAgo: "2h",
    title: "New study room now open",
    body: "The upstairs quiet room is finished and bookable from Monday. Limited seats during exam season.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
    tall: true,
    likes: 24,
    comments: 6,
  },
  {
    id: "p2",
    type: "notice",
    authorName: "Librarian",
    authorInitials: "LN",
    timeAgo: "5h",
    title: "Wi-Fi maintenance Friday",
    body: "Network will be down 1–3 PM for upgrades. Mobile hotspots still available at the front desk.",
    likes: 11,
    comments: 2,
  },
  {
    id: "p3",
    type: "news",
    authorName: "Phume Z.",
    authorInitials: "PZ",
    timeAgo: "1d",
    title: "Book swap was a hit",
    body: "Over 200 books changed hands on Saturday. Thanks to everyone who came out.",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    likes: 58,
    comments: 14,
  },
  {
    id: "p4",
    type: "notice",
    authorName: "Sipho D.",
    authorInitials: "SD",
    timeAgo: "1d",
    title: "Lost: blue notebook",
    body: "Left it near the reference desk Tuesday. Please hand it in if found — it has my exam notes.",
    likes: 4,
    comments: 9,
  },
  {
    id: "p5",
    type: "news",
    authorName: "Nandi K.",
    authorInitials: "NK",
    timeAgo: "2d",
    title: "Volunteer tutors wanted",
    body: "We're looking for matric tutors for the afternoon programme. Sign up at the desk.",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    likes: 31,
    comments: 7,
  },
  {
    id: "p6",
    type: "job",
    authorName: "Corner Market",
    authorInitials: "CM",
    timeAgo: "3h",
    title: "Cashier wanted (part-time)",
    body: "Weekends, R40/hr. Matric not required. Apply at the front desk by 15 Jul.",
    likes: 12,
    comments: 5,
  },
  {
    id: "p7",
    type: "job",
    authorName: "Malangeni Library",
    authorInitials: "ML",
    timeAgo: "6h",
    title: "Library assistant — 3-month contract",
    body: "Matric required, computer literate. Shelving, front desk and events support.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
    likes: 27,
    comments: 9,
  },
  {
    id: "p8",
    type: "job",
    authorName: "Skills Centre",
    authorInitials: "SC",
    timeAgo: "1d",
    title: "Coding tutors for youth programme",
    body: "8-week programme starting August. Stipend provided. Sign up to help teach.",
    likes: 44,
    comments: 11,
  },
];

export const PLACES: Place[] = [
  {
    id: "pl0",
    name: "Malangeni Library",
    category: "Learning",
    featured: true,
    description:
      "The community's main learning hub — study rooms, free Wi-Fi, and a busy events calendar. Start your exploring here.",
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
  },
  {
    id: "pl1",
    name: "Community Park",
    category: "Recreation",
    distanceKm: 0.8,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  },
  {
    id: "pl2",
    name: "Malangeni Clinic",
    category: "Health",
    distanceKm: 1.2,
    rating: 3,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
  },
  {
    id: "pl3",
    name: "Corner Market",
    category: "Food",
    distanceKm: 0.4,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80",
  },
  {
    id: "pl4",
    name: "Skills Centre",
    category: "Learning",
    distanceKm: 1.5,
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    id: "pl5",
    name: "Taxi Rank",
    category: "Transport",
    distanceKm: 0.6,
    rating: 3,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
  },
];

export const EXPLORE_CATEGORIES = [
  "All",
  "Learning",
  "Health",
  "Recreation",
  "Food",
  "Transport",
] as const;

export const THREADS: Thread[] = [
  {
    id: "t1",
    authorName: "Thabo M.",
    authorInitials: "TM",
    avatarColor: "#3f6e8c",
    timeAgo: "2 hours ago",
    group: "Students",
    title: "Anyone forming a matric study group?",
    body: "Looking for 3–4 people to meet at the library on weekday afternoons. Mostly maths and physical science.",
    likes: 18,
    replies: 12,
  },
  {
    id: "t2",
    authorName: "Library Notices",
    authorInitials: "LN",
    avatarColor: "#b8842b",
    timeAgo: "5 hours ago",
    group: "Official",
    title: "Extended hours during exam season",
    body: "From next week the library stays open until 8 PM on weekdays. Bring your student card for after-hours access.",
    likes: 64,
    replies: 9,
  },
  {
    id: "t3",
    authorName: "Phume Z.",
    authorInitials: "PZ",
    avatarColor: "#7d5a3f",
    timeAgo: "Yesterday",
    group: "Gardening",
    title: "Free seedlings this Saturday",
    body: "The garden club has spinach and tomato seedlings to give away. First come, first served at the back entrance.",
    likes: 41,
    replies: 6,
  },
];

export const GROUPS: Group[] = [
  { id: "g1", icon: "📚", name: "Students", members: 412 },
  { id: "g2", icon: "🌱", name: "Gardening", members: 128 },
  { id: "g3", icon: "⚽", name: "Sports", members: 256 },
];

export const NEW_MEMBERS: Member[] = [
  { initials: "SD", color: "#3f6e8c" },
  { initials: "NK", color: "#d2452f" },
  { initials: "BM", color: "#b8842b" },
  { initials: "LT", color: "#5a7d3f" },
];

export const NEW_MEMBERS_MORE = "+38 this week";

export const SERVICES: Service[] = [
  {
    id: "s1",
    icon: "📖",
    title: "Book a study room",
    description:
      "Reserve a quiet room for individual or group study. Free for members, up to 3 hours per session.",
    status: "open",
    statusLabel: "4 of 8 rooms free now",
    actionLabel: "Reserve a room",
    primary: true,
    badge: "Popular",
  },
  {
    id: "s2",
    icon: "🖨️",
    title: "Print & copy",
    description:
      "Black & white and colour printing, scanning and photocopying at the front desk.",
    status: "open",
    statusLabel: "Available",
    actionLabel: "See rates",
  },
  {
    id: "s3",
    icon: "💻",
    title: "Computer & Wi-Fi",
    description:
      "Free public computers and high-speed internet. Bring your card to log on.",
    status: "busy",
    statusLabel: "Busy — 2 PCs free",
    actionLabel: "Check availability",
  },
  {
    id: "s4",
    icon: "🎓",
    title: "Tutoring programme",
    description:
      "Free afternoon tutoring for matric learners in maths, science and English.",
    status: "open",
    statusLabel: "Mon–Thu, 3–5 PM",
    actionLabel: "Sign up",
  },
  {
    id: "s5",
    icon: "📚",
    title: "Borrow & return",
    description:
      "Browse the catalogue, reserve titles online, and pick them up at the desk.",
    status: "open",
    statusLabel: "Catalogue online",
    actionLabel: "Search catalogue",
  },
  {
    id: "s6",
    icon: "🏛️",
    title: "Hall hire",
    description:
      "Book the main hall for community meetings, workshops or events.",
    status: "busy",
    statusLabel: "Booked this weekend",
    actionLabel: "Request booking",
  },
];

export const OPENING_HOURS: OpeningHour[] = [
  { label: "Mon–Fri", value: "8:00 AM – 8:00 PM" },
  { label: "Saturday", value: "9:00 AM – 1:00 PM" },
  { label: "Sunday", value: "Closed" },
];

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
    chip: "bg-[#f7edda] text-gold",
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
    description: "Bookings, availability and outages",
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
    id: "n4",
    category: "services",
    title: "Your study room is booked",
    body: "Room 2 is held for you today, 2–5 PM. Bring your card.",
    timeAgo: "5h",
    href: "/services",
  },
  {
    id: "n5",
    category: "news",
    title: "New study room now open",
    body: "The upstairs quiet room is bookable from Monday.",
    timeAgo: "6h",
    href: "/",
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
  {
    id: "n9",
    category: "services",
    title: "Wi-Fi maintenance on Friday",
    body: "Network down 1–3 PM for upgrades. Hotspots at the desk.",
    timeAgo: "2d",
    href: "/services",
  },
];
