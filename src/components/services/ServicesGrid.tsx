import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "@/lib/data";

export function ServicesGrid() {
  return (
    <section className="mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {SERVICES.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  );
}
