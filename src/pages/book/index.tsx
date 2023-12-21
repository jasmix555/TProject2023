import Header from "@/component/Header";
import Layout from "@/component/Layout";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Calendar from "@/component/Calendar";
import Background from "@/component/Background";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import styled from "styled-components";

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

const BookContent: React.FC = () => {
  const { user } = useAuthContext();
  const userId = user?.uid || ""; // Replace with your actual user ID retrieval logic

  return <Calendar userId={userId} />;
};

const CurrentDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);

  .format {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .year {
    font-size: 3rem;
  }

  .date {
    font-size: 7rem;
    line-height: 0.8;
  }

  .month {
    font-size: 2rem;
  }
`;

export default function Book() {
  const currentDate = new Date();

  // Extract year, month, and date
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentDateNumber = currentDate.getDate();
  return (
    <Layout>
      <Header contents={menus} />
      <Background />

      <CurrentDate>
        <div className="format year">{currentYear}</div>
        <div className="format date">{currentDateNumber}</div>
        <div className="format month">{currentMonth}</div>
      </CurrentDate>
      <BookContent />
    </Layout>
  );
}
