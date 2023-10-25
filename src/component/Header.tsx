import React from "react";
import LinkBox from "./LinkBox";
import { AiFillHome } from "react-icons/ai";
import MenuBar from "@/component/MenuBar";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { useRouter } from "next/router";

export default function Header() {
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        <>
          <LinkBox link={"../"} icon={<AiFillHome />} />
          <MenuBar />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
