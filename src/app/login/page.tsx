import { Container } from "@/components/layout/Container";
import { SignInPanel } from "@/components/auth/SignInPanel";

export default function LoginPage() {
  return (
    <Container as="main">
      <SignInPanel />
    </Container>
  );
}
