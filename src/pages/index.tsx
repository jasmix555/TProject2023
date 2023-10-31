import { getApp } from "firebase/app";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import Footer from "@/component/Layout";
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
import Layout from "@/component/Layout";
import MenuBar from "@/component/MenuBar";

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
        <Layout>
          {user ? (
            <>
              <MenuBar contents={menus} />
            </>
          ) : (
            <>
              <Welcome />
            </>
          )}
          {/* <div className={style.bodyWrap}>{state === "welcome"}</div> */}
        </Layout>
      </AuthGuard>
    </>
  );
}
