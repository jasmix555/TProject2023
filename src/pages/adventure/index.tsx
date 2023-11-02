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
        <div className="homeWrapper">
          <div className="homeContent">
            <h1>Adventure</h1>
          </div>
        </div>
      </Layout>
    </>
  );
}
