"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, STAFF_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  canModerate,
  isAdmin,
  type BadgeRequest,
  type BadgeRequestStatus,
  type StaffUser,
} from "@/lib/auth/types";
import type { Page } from "@/lib/types";

/**
 * Hub-team tools: the business verification queue (admins and moderators) and
 * the team list (admins only). Hiding this page is a convenience — the backend
 * enforces every role check itself.
 */
export function StaffPanel() {
  const { firebaseUser, profile, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"requests" | "team">("requests");

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [loading, firebaseUser, router]);

  if (loading && !profile) return <Note>Loading…</Note>;
  if (!profile || !canModerate(profile)) {
    return <Note>This page is for the hub team.</Note>;
  }

  return (
    <div className="pb-16">
      {isAdmin(profile) && (
        <div className="mb-5 flex gap-2">
          <TabButton active={tab === "requests"} onClick={() => setTab("requests")}>
            Business requests
          </TabButton>
          <TabButton active={tab === "team"} onClick={() => setTab("team")}>
            Team
          </TabButton>
        </div>
      )}
      {tab === "requests" || !isAdmin(profile) ? <RequestQueue /> : <TeamList />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Business verification
// ---------------------------------------------------------------------------

const STATUSES: BadgeRequestStatus[] = ["PENDING", "APPROVED", "REJECTED"];

function RequestQueue() {
  const [status, setStatus] = useState<BadgeRequestStatus>("PENDING");
  const [pageNo, setPageNo] = useState(0);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState<Page<BadgeRequest> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api.get<Page<BadgeRequest>>(
          STAFF_ENDPOINTS.badgeRequests(status, pageNo),
        );
        if (!cancelled) {
          setPage(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load requests.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, pageNo, reload]);

  function show(next: BadgeRequestStatus) {
    setPage(null);
    setPageNo(0);
    setStatus(next);
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <TabButton key={s} active={status === s} onClick={() => show(s)} small>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </TabButton>
        ))}
      </div>

      {error ? (
        <Note>{error}</Note>
      ) : page === null ? (
        <Note>Loading…</Note>
      ) : page.content.length === 0 ? (
        <Note>
          {status === "PENDING"
            ? "No businesses waiting for verification."
            : "Nothing here yet."}
        </Note>
      ) : (
        <div className="flex flex-col gap-4">
          {page.content.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onDecided={() => setReload((n) => n + 1)}
            />
          ))}
          <Pager page={page} onPage={setPageNo} />
        </div>
      )}
    </section>
  );
}

function RequestCard({
  request,
  onDecided,
}: {
  request: BadgeRequest;
  onDecided: () => void;
}) {
  const { profile } = useAuth();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwn = profile && String(profile.id) === String(request.userId);

  async function decide(action: "approve" | "reject") {
    setError(null);
    setBusy(true);
    try {
      const body = note.trim() ? { note: note.trim() } : undefined;
      await api.post(STAFF_ENDPOINTS[action](request.id), body);
      onDecided();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the decision.");
      setBusy(false);
    }
  }

  return (
    <article className="rounded-card border border-line bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-[18px] font-semibold">
          {request.businessName}
        </h3>
        <span className="rounded-full bg-paper px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.5px] text-muted">
          {request.businessType === "FORMAL"
            ? "Formal"
            : request.businessType === "INFORMAL"
              ? "Informal"
              : "Type not given"}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-[13.5px] sm:grid-cols-2">
        <Fact label="Requested by">
          {request.user ? (
            <Link href={`/u/${encodeURIComponent(request.user.username)}`} className="font-semibold text-accent">
              {request.user.username}
            </Link>
          ) : (
            "—"
          )}
        </Fact>
        <Fact label="Requested on">{formatDate(request.createdAt)}</Fact>
        <Fact label="Category">{request.category || "—"}</Fact>
        <Fact label="Location">{request.location || "—"}</Fact>
        <Fact label="Contact number">
          {request.contactNumber ? (
            <a href={`tel:${request.contactNumber}`} className="text-accent">
              {request.contactNumber}
            </a>
          ) : (
            "—"
          )}
        </Fact>
        {request.registrationNumber && (
          <Fact label="Registration number">{request.registrationNumber}</Fact>
        )}
      </dl>
      {request.description && (
        <p className="mt-3 text-[13.5px] text-muted">{request.description}</p>
      )}

      {request.status === "PENDING" ? (
        isOwn ? (
          <p className="mt-4 text-[13px] text-muted">
            This is your own request — another team member has to review it.
          </p>
        ) : (
          <div className="mt-4 border-t border-line pt-4">
            {error && (
              <p role="alert" className="mb-3 text-[13px] text-accent">
                {error}
              </p>
            )}
            <label htmlFor={`note-${request.id}`} className="mb-1.5 block text-[13px] font-medium">
              How did you confirm it? / reason (optional)
            </label>
            <textarea
              id={`note-${request.id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder="Called the number, visited the shop… or why it can't be confirmed"
              className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-[14px] outline-none transition focus:border-accent"
            />
            <p className="mt-1 text-[12px] text-muted">
              On rejection this is shown to the member.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void decide("approve")}
                className="cursor-pointer rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Approve
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void decide("reject")}
                className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="mt-4 border-t border-line pt-3 text-[13px] text-muted">
          {request.status === "APPROVED" ? "Approved" : "Rejected"}
          {request.reviewedAt ? ` on ${formatDate(request.reviewedAt)}` : ""}
          {request.reviewNote ? ` — ${request.reviewNote}` : ""}
        </p>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Team (admins only)
// ---------------------------------------------------------------------------

function TeamList() {
  const [pageNo, setPageNo] = useState(0);
  const [reload, setReload] = useState(0);
  const [page, setPage] = useState<Page<StaffUser> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api.get<Page<StaffUser>>(STAFF_ENDPOINTS.users(pageNo));
        if (!cancelled) {
          setPage(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load members.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageNo, reload]);

  if (error) return <Note>{error}</Note>;
  if (!page) return <Note>Loading…</Note>;

  return (
    <section>
      <p className="mb-4 text-[13px] text-muted">
        Admins are set in the backend configuration and can&apos;t be changed
        here. Moderators can verify businesses, ban posters and manage content.
      </p>
      <div className="overflow-x-auto rounded-card border border-line bg-card">
        <table className="w-full min-w-[560px] text-left text-[13.5px]">
          <thead className="border-b border-line text-[12px] uppercase tracking-[0.5px] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Member</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {page.content.map((u) => (
              <TeamRow key={u.id} user={u} onChanged={() => setReload((n) => n + 1)} />
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} onPage={setPageNo} />
    </section>
  );
}

function TeamRow({ user, onChanged }: { user: StaffUser; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setRole(role: "MODERATOR" | "USER" | "BUSINESS_OWNER") {
    setError(null);
    setBusy(true);
    try {
      await api.put(STAFF_ENDPOINTS.role(user.id), { role });
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the role.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3">
        <div className="font-semibold">{user.username}</div>
        <div className="text-[12px] text-muted">{user.email}</div>
        {error && <div className="mt-1 text-[12px] text-accent">{error}</div>}
      </td>
      <td className="px-4 py-3">
        {roleLabel(user.role)}
        {user.backstage && <span className="text-muted"> · backstage</span>}
        {user.badge === "BUSINESS" && <span className="text-muted"> · business</span>}
      </td>
      <td className="px-4 py-3 text-muted">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        {user.role === "ADMIN" ? (
          <span className="text-[12px] text-muted">Set in config</span>
        ) : user.role === "MODERATOR" ? (
          <button
            type="button"
            disabled={busy}
            // Back to business owner if their business is confirmed.
            onClick={() => void setRole(user.badge === "BUSINESS" ? "BUSINESS_OWNER" : "USER")}
            className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink transition hover:border-ink disabled:opacity-60"
          >
            Remove moderator
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => void setRole("MODERATOR")}
            className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            Make moderator
          </button>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Bits
// ---------------------------------------------------------------------------

function roleLabel(role: StaffUser["role"]) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "MODERATOR":
      return "Moderator";
    case "BUSINESS_OWNER":
      return "Business owner";
    default:
      return "Member";
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Pager<T>({ page, onPage }: { page: Page<T>; onPage: (n: number) => void }) {
  if (page.totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center gap-3 text-[13px]">
      <button
        type="button"
        disabled={page.first}
        onClick={() => onPage(page.number - 1)}
        className="cursor-pointer rounded-lg border border-line px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-muted">
        Page {page.number + 1} of {page.totalPages}
      </span>
      <button
        type="button"
        disabled={page.last}
        onClick={() => onPage(page.number + 1)}
        className="cursor-pointer rounded-lg border border-line px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  small,
  children,
}: {
  active: boolean;
  onClick: () => void;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full border font-semibold transition ${
        small ? "px-3 py-1 text-[12.5px]" : "px-4 py-2 text-[13px]"
      } ${
        active
          ? "border-accent bg-accent text-white"
          : "border-line bg-card text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-muted">
        {label}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-[14px] text-muted">{children}</p>;
}
