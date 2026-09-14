import { Container } from "@/components/layout/Container";
import { PageHead } from "@/components/ui/PageHead";
import { CommunityServices } from "@/components/services/CommunityServices";
import { LibraryInfo } from "@/components/services/LibraryInfo";
import { SponsorStrip } from "@/components/ui/SponsorStrip";

export default function ServicesPage() {
  return (
    <Container as="main">
      <PageHead
        eyebrow="What we offer"
        title="Services"
        description="Local people offering their skills — plumbers, electricians, transport, tutors and more — plus where to find Malangeni Library."
      />

      <CommunityServices />

      <LibraryInfo />

      <SponsorStrip pitch="Reach people who use the library every day" />
    </Container>
  );
}
