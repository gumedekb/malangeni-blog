import Link from "next/link";
import { EVENTS } from "@/lib/data";
import type { CommunityEvent } from "@/lib/types";

const TAG_STYLES: Record<NonNullable<CommunityEvent["tag"]>, string> = {
  important: "bg-accent-soft text-accent",
  fun: "bg-fun-soft text-fun",
};

/** Upcoming events column on the home page. */
export function EventsList() {
  return (
    <aside className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-xl font-semibold">Events</h3>
        <Link href="#" className="text-[13px] font-semibold text-accent">
          See all →
        </Link>
      </div>

      {EVENTS.map((event) => (
        <Link
          key={event.id}
          href="#"
          className="flex items-center gap-3.5 rounded-[10px] border border-line border-l-[3px] border-l-accent bg-card px-4 py-3.5 transition hover:translate-x-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
        >
          <div className="min-w-[46px] text-center">
            <div className="font-serif text-[22px] font-semibold leading-none">
              {event.day}
            </div>
            <div className="text-[10px] uppercase tracking-[1px] text-muted">
              {event.month}
            </div>
          </div>
          <div>
            <h4 className="flex items-center text-[15px] font-semibold">
              {event.title}
              {event.tag && (
                <span
                  className={`ml-1.5 inline-block rounded-full px-[7px] py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] ${TAG_STYLES[event.tag]}`}
                >
                  {event.tag === "important" ? "Important" : "Fun"}
                </span>
              )}
            </h4>
            <span className="text-[12.5px] text-muted">
              {event.time} · {event.location}
            </span>
          </div>
        </Link>
      ))}
    </aside>
  );
}
