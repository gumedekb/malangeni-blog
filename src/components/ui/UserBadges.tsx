import type { Badge, Role } from "@/lib/auth/types";

/**
 * The badges shown next to someone's name.
 *
 * They come from two different places on purpose:
 *   - **Hub team** is derived from `role` (ADMIN or MODERATOR). Admin and
 *     moderator deliberately share one badge: the distinction between them is
 *     internal permissions, which means nothing to a reader — and labelling
 *     accounts "ADMIN" in public just tells an attacker which one to go after.
 *   - **Business** is the `badge` field, assigned by a moderator after they've
 *     confirmed the business is real.
 *
 * Each badge is icon *and* label. A bare icon nobody recognises makes people
 * hover and guess, and gives screen readers nothing to announce.
 */

export function UserBadges({
  role,
  badge,
  className = "",
}: {
  role?: Role | null;
  badge?: Badge | null;
  className?: string;
}) {
  const isTeam = role === "ADMIN" || role === "MODERATOR";
  const isBusiness = badge === "BUSINESS" || role === "BUSINESS_OWNER";

  if (!isTeam && !isBusiness) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {isTeam && (
        <Pill
          label="Hub team"
          title="Helps run Malangeni Hub"
          className="bg-accent-soft text-accent"
          icon={
            <path d="M12 3l7 3v5c0 4.2-2.9 7.9-7 9-4.1-1.1-7-4.8-7-9V6l7-3z" />
          }
        />
      )}
      {isBusiness && (
        <Pill
          label="Local business"
          // Wording matters: we confirmed who they are, not how they trade.
          title="A moderator confirmed this business exists and who runs it — not its prices or service"
          className="bg-[#f6efe2] text-gold"
          icon={
            <>
              <path d="M4 9h16l-1 11H5L4 9z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </>
          }
        />
      )}
    </span>
  );
}

function Pill({
  label,
  title,
  icon,
  className,
}: {
  label: string;
  title: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-semibold ${className}`}
    >
      <svg
        className="size-3 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icon}
      </svg>
      {label}
    </span>
  );
}
