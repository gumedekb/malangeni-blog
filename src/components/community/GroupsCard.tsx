"use client";

import { useState } from "react";
import { GROUPS } from "@/lib/data";

export function GroupsCard() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rounded-xl border border-line bg-card p-[18px]">
      <h4 className="mb-3 font-serif text-base font-semibold">Popular groups</h4>
      {GROUPS.map((group) => {
        const isJoined = !!joined[group.id];
        const members = group.members + (isJoined ? 1 : 0);
        return (
          <div
            key={group.id}
            className="flex items-center gap-[11px] border-t border-line py-2 first:border-t-0"
          >
            <div className="grid size-[34px] place-items-center rounded-[9px] bg-accent-soft text-[15px]">
              {group.icon}
            </div>
            <div>
              <div className="text-sm font-semibold">{group.name}</div>
              <div className="text-xs text-muted">{members} members</div>
            </div>
            <button
              type="button"
              onClick={() => toggle(group.id)}
              className={`ml-auto cursor-pointer rounded-full border border-accent px-3 py-[5px] text-xs font-semibold transition ${
                isJoined ? "bg-accent text-white" : "text-accent"
              }`}
            >
              {isJoined ? "Joined" : "Join"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
