"use client";

import { useEffect, useMemo, useState } from "react";
import { api, POST_ENDPOINTS } from "@/lib/api";
import { toFeedPost } from "@/lib/posts";
import type { ApiPost, FeedPost, FeedType, Page } from "@/lib/types";

type Filter = "all" | FeedType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "notice", label: "Notices" },
  { id: "job", label: "Jobs" },
];

export function CommunityFeed() {
  const [filter, setFilter] = useState<Filter>("all");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  // News, Notice and Job posts from the backend (discussions stay on the Community page).
  const [realPosts, setRealPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const page = await api.get<Page<ApiPost>>(POST_ENDPOINTS.list(30));
        if (cancelled) return;
        setRealPosts(
          (page?.content ?? [])
            .map(toFeedPost)
            .filter((p): p is FeedPost => p !== null),
        );
      } catch {
        /* the mock feed still shows */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(() => {
    return filter === "all" ? realPosts : realPosts.filter((post) => post.type === filter);
  }, [filter, realPosts]);

  const toggleLike = (id: string) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <div className="mb-4 mt-[34px] flex items-baseline justify-between">
        <h3 className="font-serif text-2xl font-semibold">Community feed</h3>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                filter === f.id
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line bg-card text-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="gap-5 [column-gap:20px] sm:columns-2 md:columns-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            liked={!!liked[post.id]}
            onLike={() => toggleLike(post.id)}
          />
        ))}

        {filter === "all" && (
          <article className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-dashed border-accent bg-accent-soft">
            <div className="px-4 py-6 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[1.5px] text-accent">
                Sponsored
              </div>
              <h4 className="mb-1 mt-2 font-serif text-lg font-semibold">
                Local Spaza &amp; Co.
              </h4>
              <p className="text-[13.5px] text-muted">
                Support the businesses that keep Malangeni running.
              </p>
            </div>
          </article>
        )}
      </section>
    </>
  );
}

function PostCard({
  post,
  liked,
  onLike,
}: {
  post: FeedPost;
  liked: boolean;
  onLike: () => void;
}) {
  const likeCount = post.likes + (liked ? 1 : 0);
  return (
    <article
      className={`mb-5 break-inside-avoid overflow-hidden rounded-xl border border-line transition hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(0,0,0,0.07)] ${
        post.image
          ? "bg-card"
          : "bg-[linear-gradient(150deg,var(--color-card),var(--color-paper-warm))]"
      }`}
    >
      {post.image && (
        <div
          className={`bg-cover bg-center ${post.tall ? "h-[260px]" : "h-[170px]"}`}
          style={{ backgroundImage: `url('${post.image}')` }}
        />
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="grid size-[22px] place-items-center rounded-full bg-gold text-[10px] font-semibold text-white">
            {post.authorInitials}
          </span>
          <span className="truncate">
            {post.authorName} · {post.timeAgo}
          </span>
          {post.type === "job" && (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-tag px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-gold">
              💼 Job
            </span>
          )}
        </div>
        <h4
          className={`mb-1.5 font-serif font-semibold ${post.image ? "text-lg" : "text-xl"}`}
        >
          {post.title}
        </h4>
        <p className="text-[13.5px] text-muted">{post.body}</p>
        <div className="mt-3 flex gap-4 text-xs text-muted">
          <button
            type="button"
            onClick={onLike}
            className={`cursor-pointer ${liked ? "text-accent" : "text-muted"}`}
            aria-pressed={liked}
          >
            {liked ? "♥" : "♡"} {likeCount}
          </button>
          <span>💬 {post.comments}</span>
        </div>
      </div>
    </article>
  );
}
