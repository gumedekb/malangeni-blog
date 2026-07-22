import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import { FEATURED_PLACE } from "@/lib/data";

/** The hero "Featured place" card on the home page. */
export function FeaturedPlace() {
  const place = FEATURED_PLACE;
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-card border border-line bg-card md:grid-cols-2">
      <div
        role="img"
        aria-label={`${place.name} at night`}
        className="min-h-[200px] bg-cover bg-center md:min-h-[280px]"
        style={{ backgroundImage: `url('${place.image}')` }}
      />
      <div className="flex flex-col p-[22px]">
        <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gold">
          {place.eyebrow}
        </span>
        <h2 className="mb-2 mt-1.5 font-serif text-[25px] font-semibold">
          {place.name}
        </h2>
        <p className="text-sm text-muted">{place.blurb}</p>
        <div className="mt-auto pt-[18px]">
          <div className="mb-1.5 text-[11px] uppercase tracking-[1px] text-muted">
            Visitor rating
          </div>
          <Stars rating={place.rating} className="text-lg tracking-[2px]" />
        </div>
        <Link
          href="/explore"
          className="mt-3.5 self-start rounded-lg bg-ink px-[18px] py-2.5 text-[13px] font-semibold text-white"
        >
          Visit page
        </Link>
      </div>
    </article>
  );
}
