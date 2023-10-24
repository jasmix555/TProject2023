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
import MenuBar from "@/component/menuButton";
import OptionBox from "@/component/OptionBox";
import { FaHome } from "react-icons/fa";
import style from "@/styles/Background.module.scss";

export default function Home() {
  console.log(getApp());

  return (
    <>
      <MenuBar />
      <AuthGuard>
        <Container py={4}>
          {/* <Link href={"/signup"} passHref>
            <Button>Signup</Button>
          </Link> */}
          <OptionBox icon={<FaHome />} link={"../"} />
        </Container>
      </AuthGuard>
    </>
  );
}
