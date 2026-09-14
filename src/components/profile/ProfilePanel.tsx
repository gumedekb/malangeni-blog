"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { AVATAR_ACCEPT, AvatarError } from "@/lib/avatar";
import { api, authorPostsPath } from "@/lib/api";
import type { ApiPost, Page } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { UserBadges } from "@/components/ui/UserBadges";
import { PostCard } from "./PostCard";
import { BadgeRequestForm } from "./BadgeRequestForm";
import { BusinessListingCard } from "./BusinessListingCard";

/**
 * The member's own profile: their identity and picture on the left, everything
 * they've posted on the right.
 *
 * The username is not editable here — the backend derives it and only an admin
 * can change it (there is no member-facing endpoint any more). Email and role
 * aren't editable either. The name shown is the Google account's display name,
 * which is friendlier than the email-derived handle the backend stores.
 */
export function ProfilePanel() {
  const { firebaseUser, profile, loading } = useAuth();
  const router = useRouter();

  // Signed out (or signed out mid-session) → nothing to show.
  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [loading, firebaseUser, router]);

  if (loading && !profile) {
    return <p className="py-14 text-center text-[14px] text-muted">Loading…</p>;
  }

  if (!profile) {
    return (
      <p className="py-14 text-center text-[14px] text-muted">
        We couldn&apos;t load your account. Try refreshing the page.
      </p>
    );
  }

  // Remounts if the account changes, which re-seeds everything from scratch.
  return <ProfileEditor key={String(profile.id)} />;
}

function ProfileEditor() {
  const { firebaseUser, profile: maybeProfile, uploadAvatar, removeAvatar } =
    useAuth();
  // The parent only renders this once the profile exists.
  const profile = maybeProfile!;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const picture = profile.avatarUrl ?? firebaseUser?.photoURL ?? null;
  // The Google display name reads far better than the email-derived username;
  // fall back to the stored username only when Google gave us no name.
  const displayName = firebaseUser?.displayName || profile.username;

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Let the same file be chosen again after a failure.
    e.target.value = "";
    if (!file) return;

    setError(null);
    setSaved(false);
    setUploading(true);
    try {
      // One call uploads the image and persists it — the backend returns the
      // updated record, which the context adopts.
      await uploadAvatar(file);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof AvatarError || err instanceof Error
          ? err.message
          : "Could not upload that picture.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function onRemovePicture() {
    setError(null);
    setSaved(false);
    setUploading(true);
    try {
      await removeAvatar();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not remove your picture.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
      {/* Left column — identity and account */}
      <div className="flex flex-col gap-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-accent bg-accent-soft px-3.5 py-2.5 text-[13px] text-accent"
          >
            {error}
          </p>
        )}
        {saved && !error && (
          <p
            role="status"
            className="rounded-lg border border-line bg-fun-soft px-3.5 py-2.5 text-[13px] text-fun"
          >
            Saved.
          </p>
        )}

        {/* Identity + picture */}
        <section className="rounded-card border border-line bg-card p-6">
          <div className="flex items-center gap-4">
            <Avatar src={picture} name={displayName} size={72} />
            <div className="min-w-0">
              <h2 className="truncate font-serif text-[22px] font-semibold">
                {displayName}
              </h2>
              <UserBadges
                role={profile.role}
                badge={profile.badge}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="cursor-pointer rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading…"
                : picture
                  ? "Change picture"
                  : "Upload picture"}
            </button>
            {/* Nothing to remove when the picture is just the Google photo. */}
            {profile.avatarUrl && !profile.avatarUrl.includes("googleusercontent.com") && (
              <button
                type="button"
                onClick={() => void onRemovePicture()}
                disabled={uploading}
                className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-3 text-[12.5px] text-muted">
            JPEG, PNG or WebP. It&apos;s resized on your phone before uploading,
            so it won&apos;t eat your data.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept={AVATAR_ACCEPT}
            onChange={(e) => void onPickFile(e)}
            className="hidden"
          />
        </section>

        {/* Read-only account facts */}
        <section className="rounded-card border border-line bg-card p-6">
          <h2 className="font-serif text-[20px] font-semibold">Account</h2>
          <dl className="mt-3 flex flex-col gap-3">
            <Row label="Email">
              <span className="text-[14px]">{profile.email}</span>
              <p className="mt-0.5 text-[12.5px] text-muted">
                Managed by your Google account — it can&apos;t be changed here.
              </p>
            </Row>
            {/*
              "USER" tells nobody anything — it's the default everyone has. Only
              surface a role when it actually means something, and let the badge
              beside the name carry it the rest of the time.
            */}
            {(profile.role === "ADMIN" || profile.role === "MODERATOR") && (
              <Row label="Role">
                <span className="text-[14px]">{profile.role}</span>
              </Row>
            )}
            <Row label="Member since">
              <span className="text-[14px]">
                {new Date(profile.createdAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Row>
          </dl>
        </section>

        <BadgeRequestForm />
        <BusinessListingCard />
      </div>

      {/* Right column — the member's posts */}
      <OwnPosts authorId={profile.id} />
    </div>
  );
}

/**
 * The member's own posts, or a friendly placeholder when they have none — the
 * right column would otherwise be a large empty gap beside the profile cards.
 */
function OwnPosts({ authorId }: { authorId: number | string }) {
  const [posts, setPosts] = useState<ApiPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const page = await api.get<Page<ApiPost>>(authorPostsPath(authorId));
        if (cancelled) return;
        const items = page?.content ?? [];
        // The author filter may be ignored by an older backend, so filter again
        // rather than risk showing someone else's posts on this profile.
        setPosts(items.filter((p) => String(p.authorId) === String(authorId)));
      } catch {
        if (!cancelled) setPosts([]); // The column still renders its empty state.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authorId]);

  return (
    <section>
      <h2 className="font-serif text-[20px] font-semibold">
        Your posts{posts?.length ? ` (${posts.length})` : ""}
      </h2>

      {posts === null ? (
        <p className="mt-3 text-[14px] text-muted">Loading…</p>
      ) : posts.length === 0 ? (
        <EmptyPosts />
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

/** A considered blank state, so an empty feed still feels like part of the page. */
function EmptyPosts() {
  return (
    <div className="mt-3 flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-card px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </span>
      <h3 className="mt-4 font-serif text-[18px] font-semibold">
        No posts yet
      </h3>
      <p className="mt-1.5 max-w-[320px] text-[13.5px] text-muted">
        When you share something with the community, it&apos;ll show up here for
        everyone to see.
      </p>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-3 last:border-0 last:pb-0">
      <dt className="text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">
        {label}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
