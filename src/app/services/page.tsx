import { Container } from "@/components/layout/Container";
import { PageHead } from "@/components/ui/PageHead";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { OpeningHours } from "@/components/services/OpeningHours";
import { SponsorStrip } from "@/components/ui/SponsorStrip";

export default function ServicesPage() {
  return (
    <Container as="main">
      <PageHead
        eyebrow="What we offer"
        title="Services"
        description="Everything available at Malangeni Library — book a space, get help, or use a facility."
      />
      <ServicesGrid />
      <OpeningHours />
      <SponsorStrip pitch="Reach people who use the library every day" />
    </Container>
  );
}
