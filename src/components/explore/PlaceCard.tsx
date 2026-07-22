import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import type { Place } from "@/lib/types";

/** Standard place tile in the Explore grid. */
export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(0,0,0,0.07)]">
      <div
        className="relative h-40 bg-cover bg-center"
        style={{ backgroundImage: `url('${place.image}')` }}
      >
        <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">
          {place.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold">{place.name}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          {place.distanceKm != null && (
            <span className="text-[12.5px] text-muted">
              {place.distanceKm} km away
            </span>
          )}
          {place.rating != null && (
            <Stars rating={place.rating} className="text-[13px] tracking-[1px]" />
          )}
        </div>
      </div>
    </article>
  );
}

/** Wide, promoted place tile that opens the Explore grid. */
export function FeaturedPlaceCard({ place }: { place: Place }) {
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(0,0,0,0.07)] sm:col-span-2 md:grid-cols-[1.1fr_1fr]">
      <div
        className="relative h-full min-h-[180px] bg-cover bg-center md:min-h-[230px]"
        style={{ backgroundImage: `url('${place.image}')` }}
      >
        <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">
          ★ Featured
        </span>
      </div>
      <div className="flex flex-col p-4">
        <h3 className="font-serif text-lg font-semibold">{place.name}</h3>
        <p className="mt-2 text-sm text-muted">{place.description}</p>
        <Link
          href="#"
          className="mt-auto self-start rounded-lg bg-ink px-[18px] py-2.5 text-[13px] font-semibold text-white"
        >
          View place
        </Link>
      </div>
    </article>
  );
}
