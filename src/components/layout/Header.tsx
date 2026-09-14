"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-[10px]">
      <Container>
        <nav className="flex h-[70px] items-center gap-2">
          <MobileNav />
          <Link
            href="/"
            aria-label="Malangeni Hub home"
            className="grid size-11 place-items-center rounded-full border-[1.5px] border-ink font-serif text-[15px] font-extrabold tracking-[0.5px]"
          >
            MB
          </Link>

          <div className="mx-auto hidden gap-[34px] md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-[15px] font-medium transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  } ${
                    active
                      ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent after:content-['']"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2.5 md:ml-0 md:gap-[14px]">
            <ThemeToggle />
            <NotificationBell />
            <UserMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
}
