import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Container as="main">
      <AuthForm mode="login" />
    </Container>
  );
}
