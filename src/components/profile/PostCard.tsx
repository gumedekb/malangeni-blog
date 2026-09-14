import type { ApiPost } from "@/lib/types";

/**
 * A single post as it appears in a profile's post list. Shared by a member's
 * own profile and the public profile others see, so both stay in step.
 */
export function PostCard({ post }: { post: ApiPost }) {
  return (
    <article className="rounded-xl border border-line bg-card p-[18px] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-[#f6efe2] px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-gold">
          {post.type}
        </span>
        <time dateTime={post.createdAt}>
          {new Date(post.createdAt).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <h4 className="font-serif text-lg font-semibold">{post.title}</h4>
      {post.body && (
        <p className="mt-1.5 line-clamp-3 text-sm text-muted">{post.body}</p>
      )}
      <div className="mt-3 flex gap-[18px] text-[12.5px] text-muted">
        <span>♡ {post.likeCount} likes</span>
        <span>💬 {post.commentCount} comments</span>
      </div>
    </article>
  );
}
