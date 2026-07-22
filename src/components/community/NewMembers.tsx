import { NEW_MEMBERS, NEW_MEMBERS_MORE } from "@/lib/data";

export function NewMembers() {
  return (
    <div className="rounded-xl border border-line bg-card p-[18px]">
      <h4 className="mb-3 font-serif text-base font-semibold">New members</h4>
      <div className="flex items-center">
        {NEW_MEMBERS.map((member) => (
          <div
            key={member.initials}
            className="-ml-2 grid size-8 place-items-center rounded-full border-2 border-card text-[11px] font-semibold text-white first:ml-0"
            style={{ background: member.color }}
          >
            {member.initials}
          </div>
        ))}
        <span className="ml-2.5 text-[13px] text-muted">
          {NEW_MEMBERS_MORE}
        </span>
      </div>
    </div>
  );
}
