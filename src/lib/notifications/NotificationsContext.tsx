"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NOTIFICATIONS } from "@/lib/data";
import type { AppNotification, NotificationCategory } from "@/lib/types";

/**
 * Client-side notification state: which categories the member wants and which
 * notifications they've already seen. Both are persisted to localStorage so the
 * choice survives reloads. When the backend lands, `NOTIFICATIONS` becomes a
 * fetch and these preferences move to `PATCH /me/notification-settings`.
 */

const PREFS_KEY = "malangeni.notif.prefs";
const READ_KEY = "malangeni.notif.read";

type Preferences = Record<NotificationCategory, boolean>;

const DEFAULT_PREFS: Preferences = {
  jobs: true,
  events: true,
  news: true,
  services: true,
  community: true,
};

interface NotificationsContextValue {
  /** Notifications in the member's enabled categories, newest first. */
  visible: AppNotification[];
  /** Enabled-category notifications the member hasn't opened yet. */
  unreadCount: number;
  preferences: Preferences;
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  toggleCategory: (category: NotificationCategory) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

function loadPrefs(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    // Merge over defaults so a newly-added category defaults to on.
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function loadRead(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFS);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  // Hydrate from storage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setPreferences(loadPrefs());
    setReadIds(new Set(loadRead()));
  }, []);

  const persistPrefs = useCallback((next: Preferences) => {
    setPreferences(next);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep session-only prefs */
    }
  }, []);

  const persistRead = useCallback((next: Set<string>) => {
    setReadIds(next);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCategory = useCallback(
    (category: NotificationCategory) => {
      persistPrefs({ ...preferences, [category]: !preferences[category] });
    },
    [preferences, persistPrefs],
  );

  const markRead = useCallback(
    (id: string) => {
      if (readIds.has(id)) return;
      const next = new Set(readIds);
      next.add(id);
      persistRead(next);
    },
    [readIds, persistRead],
  );

  const visible = useMemo(
    () => NOTIFICATIONS.filter((n) => preferences[n.category]),
    [preferences],
  );

  const markAllRead = useCallback(() => {
    const next = new Set(readIds);
    for (const n of visible) next.add(n.id);
    persistRead(next);
  }, [readIds, visible, persistRead]);

  const unreadCount = useMemo(
    () => visible.reduce((count, n) => (readIds.has(n.id) ? count : count + 1), 0),
    [visible, readIds],
  );

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  const value = useMemo(
    () => ({
      visible,
      unreadCount,
      preferences,
      isRead,
      markRead,
      markAllRead,
      toggleCategory,
    }),
    [visible, unreadCount, preferences, isRead, markRead, markAllRead, toggleCategory],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  return ctx;
}
