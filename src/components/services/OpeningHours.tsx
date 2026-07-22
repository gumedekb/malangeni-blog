import { OPENING_HOURS } from "@/lib/data";

export function OpeningHours() {
  return (
    <section className="mt-[26px] flex flex-wrap items-center gap-6 rounded-xl border border-line bg-card px-6 py-5">
      <h4 className="font-serif text-[17px] font-semibold">Opening hours</h4>
      {OPENING_HOURS.map((hour) => (
        <span key={hour.label} className="text-[13.5px] text-muted">
          <b className="font-semibold text-ink">{hour.label}</b> · {hour.value}
        </span>
      ))}
      <span className="ml-auto text-[13.5px] text-muted">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-open align-middle" />
        <b className="font-semibold text-ink">Open now</b>
      </span>
    </section>
  );
}
