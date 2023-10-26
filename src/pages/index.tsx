import { Container } from "@chakra-ui/react";
import { getApp } from "firebase/app";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export default function Home() {
  console.log(getApp());

  const menus = {
    icon: <RiMenu3Line />,
    options: [
      { icon: <FaRegCircleXmark />, link: "/#" },
      { icon: <FaBell />, link: "/#" },
      { icon: <FaUserAstronaut />, link: "/#" },
      { icon: <FaUsers />, link: "/#" },
      { icon: <FaEdit />, link: "/#" },
      { icon: <FaGear />, link: "/../settings" },
    ],
  };

  return (
    <>
      <AuthGuard>
        <Header contents={menus} />
        <Container py={4}>
          <Footer />
        </Container>
      </AuthGuard>
    </>
  );
}
