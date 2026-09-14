"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  ApiError,
  authorPostsPath,
  publicProfilePath,
} from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import type { PublicProfile as PublicProfileData } from "@/lib/auth/types";
import type { ApiPost, Page } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { UserBadges } from "@/components/ui/UserBadges";
import { PostCard } from "./PostCard";

/**
 * Another member's profile: who they are and what they've posted.
 *
 * Shows deliberately little — name, picture, badges, when they joined. **No
 * email**, and no role unless it's one the community benefits from seeing
 * (handled inside `UserBadges`). Note that leaving the email out here does not
 * keep it private: the backend still has to return a projection without it,
 * because anything in the response is visible in devtools.
 */
export function PublicProfile({ username }: { username: string }) {
  const { profile: viewer, loading: authLoading } = useAuth();

  const [person, setPerson] = useState<PublicProfileData | null>(null);
  const [posts, setPosts] = useState<ApiPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const viewerId = viewer ? String(viewer.id) : null;

  useEffect(() => {
    // Profiles are members-only, so wait until we know who's asking. Nothing is
    // set synchronously here — the first statement inside awaits — which keeps
    // the effect from triggering a cascading render.
    if (authLoading || !viewerId) return;
    let cancelled = false;

    void (async () => {
      try {
        const found = await api.get<PublicProfileData>(
          publicProfilePath(username),
        );
        if (cancelled) return;
        setPerson(found);

        // The author filter may not be live yet, in which case the backend
        // silently ignores it and returns everyone's posts. Filtering again
        // here means the worst case is showing too few posts, never someone
        // else's on their profile.
        try {
          const page = await api.get<Page<ApiPost>>(authorPostsPath(found.id));
          if (cancelled) return;
          const items = page?.content ?? [];
          setPosts(items.filter((p) => String(p.authorId) === String(found.id)));
        } catch {
          if (!cancelled) setPosts([]); // Profile still renders without posts.
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError(`No member called “${username}”.`);
        } else {
          setError(
            err instanceof Error ? err.message : "Could not load this profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, viewerId, username]);

  if (authLoading) {
    return <Note>Loading…</Note>;
  }

  if (!viewer) {
    return (
      <Note>
        <Link href="/login" className="font-semibold text-accent">
          Sign in
        </Link>{" "}
        to see member profiles.
      </Note>
    );
  }

  if (loading) return <Note>Loading…</Note>;
  if (error) return <Note>{error}</Note>;
  if (!person) return null;

  const isSelf = String(viewer.id) === String(person.id);

  return (
    <div className="w-full max-w-[680px] pb-16">
      <section className="rounded-card border border-line bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar src={person.avatarUrl} name={person.username} size={72} />
          <div className="min-w-0">
            <h2 className="truncate font-serif text-[24px] font-semibold">
              {person.username}
            </h2>
            <UserBadges
              role={person.role}
              badge={person.badge}
              className="mt-1.5"
            />
            {person.createdAt && (
              <p className="mt-1.5 text-[12.5px] text-muted">
                Member since{" "}
                {new Date(person.createdAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            )}
          </div>
        </div>
        {isSelf && (
          <Link
            href="/profile"
            className="mt-4 inline-block rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-ink"
          >
            Edit your profile
          </Link>
        )}
      </section>

      <h3 className="mt-8 font-serif text-[20px] font-semibold">
        Posts{posts?.length ? ` (${posts.length})` : ""}
      </h3>

      {!posts || posts.length === 0 ? (
        <p className="mt-3 rounded-card border border-line bg-card p-6 text-[14px] text-muted">
          {isSelf
            ? "You haven't posted anything yet."
            : `${person.username} hasn't posted anything yet.`}
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-14 text-[14px] text-muted">{children}</p>
  );
}
