import style from "@/styles/Footer.module.scss";
import { FaRocketchat, FaBook, FaRocket } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className={style.footerWrap}>
        <div className={style.bookWrap}>
          <FaBook />
        </div>
        <div className={style.rocketWrap}>
          <FaRocket />
        </div>
        <div className={style.chatWrap}>
          <FaRocketchat />
        </div>
      </div>
    </>
  );
}
