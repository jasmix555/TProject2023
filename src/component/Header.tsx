import React from "react";
import LinkBox from "./LinkBox";
import { AiFillHome } from "react-icons/ai";
import MenuBar from "@/component/MenuBar";
import { useAuthContext } from "@/feature/provider/AuthProvider";

type HeaderProps = {
  contents: {
    icon: any;
    options: {
      icon: any;
      link?: any;
    }[];
  };
};

export default function Header({ contents }: HeaderProps) {
  const { user } = useAuthContext();

  return (
    <>
      {user ? (
        <>
          <LinkBox link={"../"} icon={<AiFillHome />} />
          <MenuBar contents={contents} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
