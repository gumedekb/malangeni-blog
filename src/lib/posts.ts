import { timeAgo } from "./dates";
import { getInitials } from "./format";
import type { ApiPost, FeedPost } from "./types";

/** The tags a member can choose when posting. COMMUNITY is shown as "Discussion". */
export const POST_TAGS: { type: ApiPost["type"]; label: string }[] = [
  { type: "COMMUNITY", label: "Discussion" },
  { type: "NEWS", label: "News" },
  { type: "NOTICE", label: "Notice" },
  { type: "JOB", label: "Job" },
];

export function postTypeLabel(type: ApiPost["type"]): string {
  return POST_TAGS.find((t) => t.type === type)?.label ?? "Info";
}

/**
 * A real News / Notice / Job post in the home feed's card shape, so it shows
 * under the matching filter alongside the mock posts. Discussions stay on the
 * Community page and return null.
 */
export function toFeedPost(post: ApiPost): FeedPost | null {
  const type =
    post.type === "NEWS" ? "news" : post.type === "NOTICE" ? "notice" : post.type === "JOB" ? "job" : null;
  if (!type) return null;
  const author = post.author?.username ?? "Member";
  return {
    id: post.id,
    type,
    authorName: author,
    authorInitials: getInitials(author),
    timeAgo: timeAgo(post.createdAt),
    title: post.title,
    body: post.body,
    image: post.imageUrl ?? undefined,
    likes: post.likeCount,
    comments: post.commentCount,
  };
}
