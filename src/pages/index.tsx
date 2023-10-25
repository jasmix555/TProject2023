import { Container } from "@chakra-ui/react";
import { getApp } from "firebase/app";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import Footer from "@/component/Footer";

export default function Home() {
  console.log(getApp());

  return (
    <>
      <AuthGuard>
        <Container py={4}>
          <Footer />
        </Container>
      </AuthGuard>
    </>
  );
}
