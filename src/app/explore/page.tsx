import { Container } from "@/components/layout/Container";
import { PageHead } from "@/components/ui/PageHead";
import { ExploreDirectory } from "@/components/explore/ExploreDirectory";
import { SponsorStrip } from "@/components/ui/SponsorStrip";

export default function ExplorePage() {
  return (
    <Container as="main">
      <PageHead
        eyebrow="Discover"
        title="Explore"
        description="Find places, spaces and points of interest around Malangeni."
      />
      <ExploreDirectory />
      <SponsorStrip pitch="Promote your place to the whole community" />
    </Container>
  );
}
