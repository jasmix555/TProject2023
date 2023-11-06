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
        <Header contents={menus} />
        <div className={style.body}>
          <h1>Adventure</h1>
          <div className={style.planetWrapper}>
            <div className={style.planet}>
              <Link href={"#"}>
                <div className={style.planetContent}>
                  <div className={style.planet}></div>
                  <p>Planet 1 description</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
