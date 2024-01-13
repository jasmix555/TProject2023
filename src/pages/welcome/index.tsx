import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/Welcome.module.scss";
import Link from "next/link";

export default function Welcome() {
  return (
    <LayoutPage>
      <Link href="/signin">
        <div className={style.wrapper}>
          <div className={style.logo1}></div>
          <div className={style.middle}>
            <div className={style.logo2}></div>
            <div className={style.catchcopy}>
              あなたの学びを、もっと楽しく。
            </div>
          </div>
          <p>タップではじめる</p>
        </div>
      </Link>
    </LayoutPage>
  );
}
