import style from "@/styles/Footer.module.scss";
import { FaRocketchat, FaBook, FaRocket } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div>
        <div className={style.bookWrap}></div>
        <div className={style.rocketWrap}></div>
        <div className={style.chatWrap}></div>
      </div>
    </>
  );
}
