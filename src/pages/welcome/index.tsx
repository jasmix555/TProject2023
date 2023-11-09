import Background from "@/component/Background";
import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/Welcome.module.scss";
import Link from "next/link";

export default function Welcome() {
  return (
    <>
      <LayoutPage>
        <Background />
        <div className={style.wrapper}>
          <div className={style.logo}></div>
          <button>
            <Link href="/login">Start</Link>
          </button>
        </div>
      </LayoutPage>
    </>
  );
}
