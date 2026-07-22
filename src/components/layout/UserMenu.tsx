"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getInitials } from "@/lib/format";

export function UserMenu() {
  const { user, status, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const isAuthed = status === "authenticated" && !!user;
  const label = isAuthed ? getInitials(user!.name) : "You";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid size-[30px] cursor-pointer place-items-center rounded-full bg-ink text-[11px] font-semibold text-white transition hover:opacity-90"
      >
        {label}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-30 w-56 overflow-hidden rounded-xl border border-line bg-card shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
        >
          {isAuthed ? (
            <>
              <div className="border-b border-line px-4 py-3">
                <div className="truncate text-sm font-semibold">
                  {user!.name}
                </div>
                <div className="truncate text-xs text-muted">{user!.email}</div>
              </div>
              <MenuLink href="/community" onClick={() => setOpen(false)}>
                My community
              </MenuLink>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/");
                }}
                className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-accent transition hover:bg-accent-soft"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="border-b border-line px-4 py-3">
                <div className="text-sm font-semibold">Welcome</div>
                <div className="text-xs text-muted">
                  Sign in to post, join groups and book services.
                </div>
              </div>
              <MenuLink href="/login" onClick={() => setOpen(false)}>
                Log in
              </MenuLink>
              <MenuLink
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-accent"
              >
                Create an account
              </MenuLink>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  className = "",
  children,
}: {
  href: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={`block px-4 py-2.5 text-sm transition hover:bg-paper ${className}`}
    >
      {children}
    </Link>
  );
}
