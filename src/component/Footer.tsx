import style from "@/styles/Footer.module.scss";
import Link from "next/link";
import { FaRocketchat, FaBook, FaRocket } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className={style.footerWrap}>
        <div className={style.bookWrap}>
          <Link href={"#"}>
            <FaBook />
          </Link>
        </div>
        <div className={style.rocketWrap}>
          <Link href={"#"}>
            <FaRocket />
          </Link>
        </div>
        <div className={style.chatWrap}>
          <Link href={"/chat"}>
            <FaRocketchat />
          </Link>
        </div>
      </div>
    </>
  );
}
