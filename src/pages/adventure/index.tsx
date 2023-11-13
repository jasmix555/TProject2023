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

const worlds = [
  {
    title: "日本語",
    link: "/createdGroups",
  },
  {
    title: "English",
    link: "/createdGroups",
  },
  {
    title: "한국어",
    link: "/createdGroups",
  },
  {
    title: "中文",
    link: "/createdGroups",
  },
  {
    title: "Bahasa Indonesia",
    link: "/createdGroups",
  },
  {
    title: "español",
    link: "/createdGroups",
  },
];

export default function HomePage() {
  return (
    <>
      <Layout>
        <Background />
        <Header contents={menus} />
        <div className={style.body}>
          <div className={style.worldsWrap}>
            {worlds.map((e, idx) => (
              <div
                key={idx}
                className={
                  style.content +
                  " " +
                  (idx % 2 === 0 ? style.left : style.right)
                }
              >
                <Link href={e.link}>
                  <div
                    className={style.planet}
                    style={{
                      backgroundImage: `url(../planets/${idx + 1}.svg)`,
                    }}
                  ></div>
                  <p>{e.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
