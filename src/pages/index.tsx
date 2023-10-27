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
import style from "../styles/index.module.scss";
import { useState } from "react";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import Welcome from "./welcome";

export default function Home() {
  const { user } = useAuthContext();

  console.log(getApp());

  const [state, setState] = useState<pages>("welcome");

  const menus = {
    icon: <RiMenu3Line />,
    options: [
      { icon: <FaRegCircleXmark />, link: "/#" },
      { icon: <FaBell />, link: "/#" },
      { icon: <FaUserAstronaut />, link: "/#" },
      { icon: <FaUsers />, link: "/#" },
      { icon: <FaEdit />, link: "/#" },
      { icon: <FaGear />, link: "/settings" },
    ],
  };

  // const changeState = (page: pages) => {
  //   setState(page);
  // };

  const [contents, setContents] = useState(menus);

  return (
    <>
      <AuthGuard>
        {user ? (
          <>
            <Header contents={menus} />
            <Footer />
          </>
        ) : (
          <>
            <Welcome />
          </>
        )}
        <div className={style.bodyWrap}>{state === "welcome"}</div>
      </AuthGuard>
    </>
  );
}
