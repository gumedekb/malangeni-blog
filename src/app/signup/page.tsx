import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <Container as="main">
      <AuthForm mode="signup" />
    </Container>
  );
}
