import style from "@/styles/Login.module.scss";
import Link from "next/link";

export default function Login() {
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
              <button>
                <Link href="/signup">新規登録</Link>
              </button>
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
