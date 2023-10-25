import { getApp } from "firebase/app";
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Wrap,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

export default function Home() {
  const try = "hi";
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

