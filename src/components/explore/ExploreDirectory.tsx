"use client";

import { useEffect, useMemo, useState } from "react";
import { PlaceCard, FeaturedPlaceCard } from "./PlaceCard";
import { api, PLACE_ENDPOINTS } from "@/lib/api";
import { EXPLORE_CATEGORIES } from "@/lib/data";
import { byRating, toPlace } from "@/lib/places";
import type { ApiAttraction, Page, Place } from "@/lib/types";

export function ExploreDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof EXPLORE_CATEGORIES)[number]>("All");
  const [places, setPlaces] = useState<Place[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const page = await api.get<Page<ApiAttraction>>(PLACE_ENDPOINTS.list);
        if (!cancelled) setPlaces([...(page?.content ?? [])].sort(byRating).map(toPlace));
      } catch {
        if (!cancelled) setPlaces([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = (places ?? []).filter((place) => {
      const matchesCategory =
        category === "All" || place.category === category;
      const matchesTerm =
        term === "" ||
        place.name.toLowerCase().includes(term) ||
        place.category.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
    // The best-rated place leads the unfiltered grid as the wide featured card.
    const featureFirst = category === "All" && term === "";
    return filtered.map((place, i) => ({ ...place, featured: featureFirst && i === 0 }));
  }, [places, query, category]);

  return (
    <>
      <form
        className="mt-[22px] flex flex-col gap-2.5 sm:flex-row"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search places, e.g. study spaces, parks, clinics…"
          className="flex-1 rounded-[10px] border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:outline-2 focus:outline-accent"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-[10px] bg-ink px-[22px] py-3.5 text-sm font-semibold text-on-ink sm:py-0"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-[9px]">
        {EXPLORE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`cursor-pointer rounded-full border px-[15px] py-[7px] text-[13.5px] transition ${
              category === cat
                ? "border-accent bg-accent-soft text-accent"
                : "border-line bg-card text-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {places === null ? (
          <p className="col-span-full py-10 text-center text-sm text-muted">Loading…</p>
        ) : results.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-muted">
            {places.length === 0
              ? "No places have been added yet."
              : "No places match your search. Try another category or term."}
          </p>
        ) : (
          results.map((place) =>
            place.featured ? (
              <FeaturedPlaceCard key={place.id} place={place} />
            ) : (
              <PlaceCard key={place.id} place={place} />
            ),
          )
        )}
      </section>
    </>
  );
}
