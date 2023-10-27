import style from "@/styles/Footer.module.scss";
import { FaRocketchat, FaBook, FaRocket } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className={style.footerWrap}>
        <div className={style.bookWrap}>
          <button>
            <FaBook />
          </button>
        </div>
        <div className={style.rocketWrap}>
          <button>
            <FaRocket />
          </button>
        </div>
        <div className={style.chatWrap}>
          <button>
            <FaRocketchat />
          </button>
        </div>
      </div>
    </>
  );
}
