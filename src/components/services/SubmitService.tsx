"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import type { ApiService } from "@/lib/types";
import { ServiceForm } from "./ServiceForm";

/** Any signed-in member can list a service; the hub team approves it before it goes public. */
export function SubmitService() {
  const { firebaseUser, profile, loading, error: authError } = useAuth();
  const router = useRouter();
  const [done, setDone] = useState<{ service: ApiService; warning?: string } | null>(null);

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/login");
  }, [loading, firebaseUser, router]);

  if (!profile) {
    return <p className="py-14 text-[14px] text-muted">{authError ?? "Loading…"}</p>;
  }

  if (done) {
    const live = done.service.status === "APPROVED";
    return (
      <section className="max-w-[640px] rounded-card border border-line bg-card p-6">
        <h2 className="font-serif text-[20px] font-semibold">
          {live ? "Your service is listed" : "Thanks — your service was sent for approval"}
        </h2>
        <p className="mt-2 text-[14px] text-muted">
          {live
            ? "It's on the services page now."
            : "The hub team will check it and publish it. If something needs changing, they'll leave you a note — you'll see it under “Your services”."}
        </p>
        {done.warning && (
          <p className="mt-3 rounded-lg border border-accent bg-accent-soft px-3.5 py-2.5 text-[13px] text-accent">
            {done.warning}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/services"
            className="rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-95"
          >
            See your services
          </Link>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-ink"
          >
            List another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16 max-w-[720px] rounded-card border border-line bg-card p-6">
      <p className="mb-5 text-[13.5px] text-muted">
        Services are checked by the hub team before they appear.
      </p>
      <ServiceForm onSaved={(service, warning) => setDone({ service, warning })} />
    </section>
  );
}
