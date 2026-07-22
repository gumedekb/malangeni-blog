"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/nav";
import { useAuth } from "@/lib/auth/AuthContext";
import { getInitials } from "@/lib/format";

/**
 * Small-screen navigation: a hamburger trigger (shown below the `md`
 * breakpoint) that opens a dropdown menu anchored under the button, with the
 * nav links (each with an icon) and the auth actions. Hidden on desktop, where
 * the inline nav is used instead.
 */

/** Minimal glyphs keyed by nav href, to make the menu scannable. */
const NAV_ICONS: Record<string, React.ReactNode> = {
  "/": <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />,
  "/explore": (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  "/community": (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 4.5a3.2 3.2 0 0 1 0 6.3M21 20c0-2.5-1.4-4.7-3.5-5.6" />
    </>
  ),
  "/services": <path d="M4 7h16M4 12h16M4 17h10" />,
};

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAuthed = status === "authenticated" && !!user;

  return (
    <div className="relative md:hidden" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`grid size-9 place-items-center rounded-full transition ${
          open ? "bg-card text-ink" : "text-ink hover:bg-card"
        }`}
      >
        <svg
          className="size-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="menu"
          aria-label="Menu"
          className="absolute left-0 top-[calc(100%+10px)] z-30 w-[264px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-line bg-card shadow-[0_16px_44px_rgba(0,0,0,0.16)]"
        >
          <nav className="flex flex-col gap-0.5 p-2">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-ink hover:bg-paper"
                  }`}
                >
                  <svg
                    className="size-[19px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {NAV_ICONS[link.href]}
                  </svg>
                  <span className="flex-1">{link.label}</span>
                  <svg
                    className={`size-4 shrink-0 transition ${
                      active
                        ? "text-accent"
                        : "text-line group-hover:translate-x-0.5 group-hover:text-muted"
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-line p-2">
            {isAuthed ? (
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  {getInitials(user!.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {user!.name}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {user!.email}
                  </div>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    logout();
                    close();
                    router.push("/");
                  }}
                  className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-semibold text-accent transition hover:bg-accent-soft"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-1">
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={close}
                  className="rounded-lg border border-ink px-4 py-2.5 text-center text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  role="menuitem"
                  onClick={close}
                  className="rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
