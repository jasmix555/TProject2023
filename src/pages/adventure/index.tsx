import Layout from "@/component/Layout";
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
import Header from "@/component/Header";
import style from "@/styles/adventure.module.scss";
import Link from "next/link";
import Background from "@/component/Background";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaBook />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};

export default function HomePage() {
  return (
    <>
      <Layout>
        <Background />
        <Header contents={menus} />
        <div className={style.body}>
          <div className={style.worldsWrap}>
            <div className={style.content + " " + style.left}>
              <Link href={"/createdGroups"}>
                <div className={style.planet}></div>
                <p>日本語</p>
              </Link>
            </div>
            <div className={style.content + " " + style.right}>
              <Link href={"#"}>
                <div className={style.planet}></div>
                <p>English</p>
              </Link>
            </div>
            <div className={style.content + " " + style.left}>
              <Link href={"#"}>
                <div className={style.planet}></div>
                <p>한국어</p>
              </Link>
            </div>
            <div className={style.content + " " + style.right}>
              <Link href={"#"}>
                <div className={style.planet}></div>
                <p>中文</p>
              </Link>
            </div>
            <div className={style.content + " " + style.left}>
              <Link href={"#"}>
                <div className={style.planet}></div>
                <p>Bahasa Indonesia</p>
              </Link>
            </div>
            <div className={style.content + " " + style.right}>
              <Link href={"#"}>
                <div className={style.planet}></div>
                <p>español</p>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
