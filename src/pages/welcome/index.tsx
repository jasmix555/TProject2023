import Background from "@/component/Background";
import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/Welcome.module.scss";
import Link from "next/link";

export default function Welcome() {
  return (
    <LayoutPage>
      <Background />
      <Link href="/login">
        <div className={style.wrapper}>
          <div className={style.logo1}></div>
          <div className={style.logo2}></div>
          <p>タップではじめる</p>
        </div>
      </Link>
    </LayoutPage>
  );
}
