import style from "@/styles/Footer.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import { footerArray } from "@/lib/nav/footerTypes";
import { Icon } from "@chakra-ui/react";
import Motion from "./Motion";

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
    <>
      <Motion>{children}</Motion>
      <div className={style.footerWrap}>
        {footerArray.map((e, idx) => {
          if (pathStat == e.path) {
            // console.log("success");
            return (
              <div className={style.footerItem} key={idx}>
                <button className={style.active + " " + style.border}>
                  <Link href={e.path} className={style.button}>
                    <Icon as={e.icon} />
                  </Link>
                </button>
              </div>
            );
          } else {
            // console.log("fail");
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
    </>
  );
}
