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
import { useAuthContext } from "@/feature/provider/AuthProvider";
import styled from "styled-components";
import { useState } from "react";
import style from "@/styles/book.module.scss";
import Calendar from "./component/Calendar";
import SavedWords from "./component/SavedWords";
import BookHeader from "./component/BookHeader";

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

export function BookContent() {
  const { user } = useAuthContext();
  const userId = user?.uid || "";

  const [tab, setTab] = useState(1);

  const First = () => {
    return (
      <>
        <SavedWords userId={userId} />
      </>
    );
  };

  const Second = () => {
    return (
      <>
        <Calendar userId={userId} />
      </>
    );
  };

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <BookHeader />
      </div>
      <div className={style.tabWrapper}>
        <div className={style.tabBtns}>
          <button
            className={tab === 1 ? style.active : ""}
            onClick={() => setTab(1)}
          >
            <span>All</span>
          </button>
          <button
            className={tab === 2 ? style.active : ""}
            onClick={() => setTab(2)}
          >
            <span>Month</span>
          </button>
        </div>
        {tab === 1 ? (
          <div className={style.tabContent}>
            <First />
          </div>
        ) : (
          <Second />
        )}
      </div>
    </div>
  );
}

const CurrentDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding-bottom: 1rem;

  .format {
    font-weight: 900;
    color: var(--white);
    line-height: 1.2;
    -webkit-text-stroke: var(--border-clr) 2px;
  }

  .year {
    font-size: 3.4rem;
  }

  .date {
    font-size: 7rem;
    line-height: 0.8;
    -webkit-text-stroke: var(--border-clr) 3px;
  }

  .month {
    font-size: 3rem;
  }
`;

export default function Book() {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const currentDateNumber = currentDate.getDate();
  return (
    <Layout>
      <Header contents={menus} />

      <CurrentDate>
        <div className="format year">{currentYear}</div>
        <div className="format date">{currentDateNumber}</div>
        <div className="format month">{currentMonth}</div>
      </CurrentDate>

      <BookContent />
    </Layout>
  );
}
