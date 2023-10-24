import { Flex, MenuButton } from "@chakra-ui/react";
import React from "react";
import LinkBox from "./LinkBox";
import { FaHome } from "react-icons/fa";
import MenuBar from "@/component/MenuBar";

export default function Header() {
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <LinkBox link={"../"} icon={<FaHome />} />
        <MenuBar />
      </Flex>
    </>
  );
}
