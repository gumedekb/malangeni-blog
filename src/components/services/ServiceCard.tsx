"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";

/** Confirmation label shown after a booking action is taken. */
const CONFIRMATION: Record<string, string> = {
  "Reserve a room": "Room requested ✓",
  "Sign up": "Signed up ✓",
  "Request booking": "Request sent ✓",
};

export function ServiceCard({ service }: { service: Service }) {
  const [done, setDone] = useState(false);
  const confirmed = CONFIRMATION[service.actionLabel] ?? "Done ✓";

  return (
    <article
      className={`flex flex-col rounded-xl border p-[22px] transition hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(0,0,0,0.07)] ${
        service.primary
          ? "border-ink bg-ink text-white"
          : "border-line bg-card"
      }`}
    >
      {service.badge && (
        <span className="mb-2.5 self-start rounded-full bg-accent px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.5px] text-white">
          {service.badge}
        </span>
      )}

      <div
        className={`mb-3.5 grid size-[46px] place-items-center rounded-[11px] text-[22px] ${
          service.primary ? "bg-white/[0.12]" : "bg-accent-soft"
        }`}
      >
        {service.icon}
      </div>

      <h3 className="mb-1.5 font-serif text-[19px] font-semibold">
        {service.title}
      </h3>
      <p
        className={`flex-1 text-[13.5px] ${
          service.primary ? "text-white/70" : "text-muted"
        }`}
      >
        {service.description}
      </p>

      <div
        className={`mt-3.5 flex items-center gap-2 text-xs ${
          service.primary ? "text-white/70" : "text-muted"
        }`}
      >
        <span
          className={`size-[7px] rounded-full ${
            service.status === "open" ? "bg-open" : "bg-gold"
          }`}
        />
        {service.statusLabel}
      </div>

      <button
        type="button"
        onClick={() => setDone((v) => !v)}
        aria-pressed={done}
        className={`mt-3.5 cursor-pointer rounded-[9px] border p-2.5 text-[13.5px] font-semibold transition ${
          done
            ? "border-open bg-open text-white"
            : service.primary
              ? "border-white text-white hover:bg-white hover:text-ink"
              : "border-ink text-ink hover:bg-ink hover:text-white"
        }`}
      >
        {done ? confirmed : service.actionLabel}
      </button>
    </article>
  );
}
