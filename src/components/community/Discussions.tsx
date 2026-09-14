"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, COMMUNITY_ENDPOINTS, POST_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import { canModerate, isOwner } from "@/lib/auth/types";
import { timeAgo } from "@/lib/dates";
import { POST_TAGS, postTypeLabel } from "@/lib/posts";
import { IMAGE_ACCEPT, imageProblem, prepareImage } from "@/lib/images";
import type { ApiGroup, ApiPost, Page } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { UserBadges } from "@/components/ui/UserBadges";

type Tag = ApiPost["type"];

/**
 * The Community page's composer and post list.
 *
 * Posts are saved to the backend with a tag (Discussion / News / Notice / Job)
 * and, optionally, a group. News, notices and jobs also show on the home feed
 * under the matching filter. The mock threads stay below the real posts until
 * there's real content.
 */
export function Discussions() {
  const { firebaseUser, profile } = useAuth();
  const router = useRouter();
  const viewerId = profile ? String(profile.id) : null;

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<Tag>("COMMUNITY");
  const [groupId, setGroupId] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  // Local preview of the chosen picture; the object URL is released when it changes.
  const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function pickImage(file: File | null) {
    if (!file) return;
    const problem = imageProblem(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setImage(file);
  }

  // Re-read when the viewer changes: `likedByCurrentUser` depends on who asks.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [page, groupList] = await Promise.all([
        api.get<Page<ApiPost>>(POST_ENDPOINTS.list()).catch(() => null),
        api.get<ApiGroup[]>(COMMUNITY_ENDPOINTS.groups).catch(() => []),
      ]);
      if (cancelled) return;
      setPosts(page?.content ?? []);
      setGroups(groupList ?? []);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [viewerId]);

  const groupName = (id?: string | null) =>
    id ? groups.find((g) => g.id === id)?.name ?? null : null;

  async function submit() {
    // Posting identifies the current user — require sign-in.
    if (!profile) {
      router.push("/login");
      return;
    }
    if (!title.trim()) {
      setExpanded(true);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      let saved = await api.post<ApiPost>(POST_ENDPOINTS.create, {
        title: title.trim(),
        body: body.trim(),
        type: tag,
        groupId: groupId || undefined,
      });
      // The post exists first; the picture is attached to it afterwards.
      let imageFailed = false;
      if (image) {
        try {
          const form = new FormData();
          form.append("file", await prepareImage(image));
          saved = await api.postForm<ApiPost>(POST_ENDPOINTS.image(saved.id), form);
        } catch (err) {
          imageFailed = true;
          setError(
            `Your post was shared, but the picture didn't upload${
              err instanceof Error ? `: ${err.message}` : "."
            }`,
          );
        }
      }
      setPosts((prev) => [saved, ...prev]);
      setTitle("");
      setBody("");
      setTag("COMMUNITY");
      setGroupId("");
      setImage(null);
      if (!imageFailed) setExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not share your post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleLike(post: ApiPost) {
    if (!firebaseUser) {
      router.push("/login");
      return;
    }
    const liking = !post.likedByCurrentUser;
    try {
      if (liking) await api.post(POST_ENDPOINTS.likes(post.id));
      else await api.del(POST_ENDPOINTS.likes(post.id));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likedByCurrentUser: liking,
                likeCount: Math.max(0, p.likeCount + (liking ? 1 : -1)),
              }
            : p,
        ),
      );
    } catch {
      /* unchanged; they can try again */
    }
  }

  async function remove(post: ApiPost) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    try {
      await api.del(POST_ENDPOINTS.post(post.id));
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the post.");
    }
  }

  const picture = profile?.avatarUrl ?? firebaseUser?.photoURL ?? null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="rounded-xl border border-line bg-card p-4"
      >
        <div className="flex items-center gap-3">
          <Avatar src={picture} name={profile?.username} size={38} />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => profile && setExpanded(true)}
            maxLength={255}
            aria-label="Post title"
            placeholder={
              profile
                ? "Share something with the community…"
                : "Sign in to share something with the community…"
            }
            className="min-w-0 flex-1 rounded-3xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={submitting || (!!profile && !title.trim())}
            className="cursor-pointer rounded-3xl bg-accent px-[18px] py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>

        {expanded && profile && (
          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-3">
            {error && (
              <p role="alert" className="rounded-lg border border-accent bg-accent-soft px-3.5 py-2.5 text-[13px] text-accent">
                {error}
              </p>
            )}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              aria-label="Post details"
              placeholder="Add details (optional)"
              className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            />

            <div>
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">
                Picture (optional)
              </div>
              {preview ? (
                <div>
                  <Image
                    src={preview}
                    alt="Selected picture"
                    width={480}
                    height={320}
                    unoptimized
                    className="h-auto max-h-48 w-auto rounded-lg border border-line"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="mt-1.5 cursor-pointer text-[12.5px] font-semibold text-accent"
                  >
                    Remove picture
                  </button>
                </div>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:border-ink">
                  <span aria-hidden="true">📷</span> Add a picture
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      // Let the same file be chosen again after removing it.
                      e.target.value = "";
                      pickImage(file);
                    }}
                  />
                </label>
              )}
              <p className="mt-1 text-[12px] text-muted">
                JPEG, PNG or WebP. It&apos;s resized on your phone before uploading.
              </p>
            </div>

            <div>
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.5px] text-muted">
                Tag
              </div>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Post tag">
                {POST_TAGS.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    role="radio"
                    aria-checked={tag === t.type}
                    onClick={() => setTag(t.type)}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                      tag === t.type
                        ? "border-ink bg-ink text-on-ink"
                        : "border-line bg-card text-muted hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {tag !== "COMMUNITY" && (
                <p className="mt-1.5 text-[12px] text-muted">
                  Also shown on the home feed under {postTypeLabel(tag)}
                  {tag === "NEWS" ? "" : "s"}.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="post-group"
                className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.5px] text-muted"
              >
                Group
              </label>
              <select
                id="post-group"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                disabled={groups.length === 0}
                className="w-full cursor-pointer rounded-[10px] border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <option value="">{groups.length === 0 ? "No groups yet" : "No group"}</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon ? `${g.icon} ` : ""}
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setError(null);
                }}
                className="cursor-pointer text-[13px] font-semibold text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-[18px] flex flex-col gap-4">
        {posts.map((post) => {
          const group = groupName(post.groupId);
          const canDelete = isOwner(profile, post.authorId) || canModerate(profile);
          return (
            <article
              key={post.id}
              className="rounded-xl border border-line bg-card p-[18px] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <Avatar src={post.author?.avatarUrl} name={post.author?.username} size={34} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.author ? (
                      <Link
                        href={`/u/${encodeURIComponent(post.author.username)}`}
                        className="text-sm font-semibold hover:underline"
                      >
                        {post.author.username}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold">Member</span>
                    )}
                    <UserBadges role={post.author?.role} badge={post.author?.badge} />
                  </div>
                  <div className="text-xs text-muted">{timeAgo(post.createdAt)}</div>
                </div>
                <div className="ml-auto flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-tag px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-gold">
                    {postTypeLabel(post.type)}
                  </span>
                  {group && (
                    <Link
                      href={`/community/groups/${encodeURIComponent(post.groupId!)}`}
                      className="rounded-full bg-accent-soft px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-accent"
                    >
                      {group}
                    </Link>
                  )}
                </div>
              </div>
              <h3 className="mb-1.5 font-serif text-lg font-semibold">{post.title}</h3>
              {post.body && <p className="whitespace-pre-line text-sm text-muted">{post.body}</p>}
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt=""
                  width={1200}
                  height={800}
                  unoptimized
                  className="mt-3 h-auto max-h-[420px] w-full rounded-lg border border-line object-cover"
                />
              )}
              <div className="mt-3 flex gap-[18px] text-[12.5px] text-muted">
                <button
                  type="button"
                  onClick={() => void toggleLike(post)}
                  className={`cursor-pointer ${post.likedByCurrentUser ? "text-accent" : ""}`}
                  aria-pressed={!!post.likedByCurrentUser}
                >
                  {post.likedByCurrentUser ? "♥" : "♡"} {post.likeCount} likes
                </button>
                <span>💬 {post.commentCount} replies</span>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => void remove(post)}
                    className="ml-auto cursor-pointer text-accent"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {!loaded ? (
          <p className="py-6 text-center text-[14px] text-muted">Loading…</p>
        ) : (
          posts.length === 0 && (
            <p className="rounded-xl border border-dashed border-line bg-card p-6 text-center text-[14px] text-muted">
              Nothing has been posted yet — start the conversation.
            </p>
          )
        )}
      </div>
    </div>
  );
}
