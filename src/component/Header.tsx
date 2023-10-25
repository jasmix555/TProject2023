import { Flex, MenuButton } from "@chakra-ui/react";
import React from "react";
import LinkBox from "./LinkBox";
import { FaHome } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import MenuBar from "@/component/MenuBar";

export default function Header() {
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        padding={6}
        position={"fixed"}
        w={"100%"}
        zIndex={10}
      >
        <LinkBox link={"../"} icon={<AiFillHome />} />
        <MenuBar />
      </Flex>
    </>
  );
}
