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

export default function Home() {
  console.log(getApp());

  return (
    <>
      <AuthGuard>
        <Container py={4}>
          <Header />
          {/* <Link href={"/signup"} passHref>
            <Button>Signup</Button>
          </Link> */}
        </Container>
      </AuthGuard>
    </>
  );
}
