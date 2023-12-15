import Header from "@/component/Header";
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
import Calendar from "@/component/Calendar";
import Background from "@/component/Background";
import { useAuthContext } from "@/feature/provider/AuthProvider";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};

function Book() {
  return (
    <Layout>
      <Header contents={menus} />
      <Background />
      <BookContent />
    </Layout>
  );
}

export default Book;

const BookContent: React.FC = () => {
  const { user } = useAuthContext();
  const userId = user?.uid || ""; // Replace with your actual user ID retrieval logic

  return <Calendar userId={userId} />;
};
