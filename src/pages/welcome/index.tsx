import style from "@/styles/Welcome.module.scss";
import Link from "next/link";

export default function Welcome() {
  return (
    <>
      <div className={style.wrapper}>
        <div className={style.mainVis}>
          <div className={style.logo}></div>
          <div className={style.catchphrase}>
            <p>あなたの学びを、</p>
            <p>もっと楽しく。</p>
          </div>
        </div>
        <div className={style.footerWrap}>
          <div className={style.register}>
            <div className={style.registerBtn}>
              <Link href="/signup">新規登録はこちら</Link>
            </div>
          </div>
          <div className={style.login}>
            <div className={style.loginBtn}>
              <Link href="/signin">アカウントをお持ちの方はこちら</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
