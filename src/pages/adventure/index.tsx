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
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

const variants = {
  hidden: { opacity: 0, y: 100 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
    y: 0,
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
    y: 100,
  },
};

export default function HomePage() {
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  useEffect(() => {
    setRandomNumbers(worlds.map(() => Math.floor(Math.random() * 3) + 1));
  }, []);

  return (
    <>
      <Layout>
        <Background />
        <Header contents={menus} />
        <div className={style.body}>
          <div className={style.worldsWrap}>
            {worlds.map((e, idx) => {
              const [ref, inView] = useInView({
                triggerOnce: true,
              });

              return (
                <motion.div
                  ref={ref}
                  variants={variants}
                  initial="hidden"
                  animate={inView ? "show" : "hidden"}
                  exit="out"
                  key={idx}
                  className={
                    style.content +
                    " " +
                    (idx % 2 === 0 ? style.left : style.right)
                  }
                >
                  <Link href={`${e.link}?planet=${idx + 1}`}>
                    <div
                      className={`${style.planet} ${
                        style[`image${randomNumbers[idx]}`]
                      }`}
                      style={{
                        backgroundImage: `url(../planets/${idx + 1}.svg)`,
                      }}
                    ></div>
                    <p>{e.title}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
}
