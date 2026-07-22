"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THREADS } from "@/lib/data";
import type { Thread } from "@/lib/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getInitials } from "@/lib/format";

export function Discussions() {
  const { user } = useAuth();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const myInitials = user ? getInitials(user.name) : "You";

  const post = () => {
    // Posting identifies the current user — require sign-in.
    if (!user) {
      router.push("/login");
      return;
    }
    const title = draft.trim();
    if (!title) return;
    const newThread: Thread = {
      id: `local-${Date.now()}`,
      authorName: user.name,
      authorInitials: myInitials,
      avatarColor: "#b8842b",
      timeAgo: "Just now",
      group: "General",
      title,
      body: "",
      likes: 0,
      replies: 0,
    };
    setThreads((prev) => [newThread, ...prev]);
    setDraft("");
  };

  const toggleLike = (id: string) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-4">
        <div className="grid size-[38px] shrink-0 place-items-center rounded-full bg-gold text-[13px] font-semibold text-white">
          {myInitials}
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder={
            user
              ? "Share something with the community…"
              : "Log in to share something with the community…"
          }
          className="flex-1 rounded-3xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={post}
          disabled={!!user && !draft.trim()}
          className="cursor-pointer rounded-3xl bg-accent px-[18px] py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>

      <div className="mt-[18px] flex flex-col gap-4">
        {threads.map((thread) => {
          const isLiked = !!liked[thread.id];
          return (
            <article
              key={thread.id}
              className="rounded-xl border border-line bg-card p-[18px] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-2.5 flex items-center gap-2.5">
                <div
                  className="grid size-[34px] place-items-center rounded-full text-xs font-semibold text-white"
                  style={{ background: thread.avatarColor }}
                >
                  {thread.authorInitials}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {thread.authorName}
                  </div>
                  <div className="text-xs text-muted">{thread.timeAgo}</div>
                </div>
                <span className="ml-auto rounded-full bg-[#f6efe2] px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-gold">
                  {thread.group}
                </span>
              </div>
              <h3 className="mb-1.5 font-serif text-lg font-semibold">
                {thread.title}
              </h3>
              {thread.body && <p className="text-sm text-muted">{thread.body}</p>}
              <div className="mt-3 flex gap-[18px] text-[12.5px] text-muted">
                <button
                  type="button"
                  onClick={() => toggleLike(thread.id)}
                  className={`cursor-pointer ${isLiked ? "text-accent" : ""}`}
                  aria-pressed={isLiked}
                >
                  {isLiked ? "♥" : "♡"} {thread.likes + (isLiked ? 1 : 0)} likes
                </button>
                <span className="cursor-pointer">💬 {thread.replies} replies</span>
                <span className="cursor-pointer">↗ Share</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
