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
import Layout from "@/component/Layout";
import Header from "@/component/Header";
import Link from "next/link";
import style from "@/styles/chat.module.scss";
import BackBtn from "@/component/BackBtn";

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

export default function ChatPage() {
  return (
    <Layout>
      <Header contents={menus} />
      <h1>Chat</h1>
      <div className={style.buttons}>
        <button className={style.groupChat}>
          <Link href="/groupChat">着陸する！</Link>
        </button>
        <BackBtn />
      </div>
    </Layout>
  );
}
