import style from "@/styles/Footer.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import { footerArray } from "@/lib/nav/footerTypes";
import { Icon } from "@chakra-ui/react";
import Motion from "./Motion";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pathStat, setPathStat] = useState("/");

  useEffect(() => {
    if (location.pathname == "/") {
      setPathStat("/");
    } else if (location.pathname == "/book") {
      setPathStat("/book");
    } else if (location.pathname == "/adventure") {
      setPathStat("/adventure");
    } else if (location.pathname == "/learning") {
      setPathStat("/learning");
    } else {
      setPathStat("/");
    }
  }, []);

  return (
    <AuthGuard>
      <Motion>{children}</Motion>
      <div className={style.footerWrap} style={{ zIndex: 1 }}>
        {footerArray.map((e, idx) => {
          if (pathStat == e.path) {
            return (
              <div className={style.footerItem} key={idx}>
                <div className={style.border}></div>
                <button className={style.active}>
                  <Link href={e.path} className={style.button}>
                    <Icon as={e.icon} />
                  </Link>
                </button>
              </div>
            );
          } else {
            return (
              <div className={style.footerItem} key={idx}>
                <button>
                  <Link href={e.path} className={style.button}>
                    <Icon as={e.icon} />
                  </Link>
                </button>
              </div>
            );
          }
        })}
      </div>
    </AuthGuard>
  );
}
