import style from "@/styles/Footer.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import { footerArray } from "@/utils/footerTypes";
import { Icon } from "@chakra-ui/react";
import { cubicBezier, motion } from "framer-motion";
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

  const variant = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: cubicBezier(0.4, 0, 0.2, 1),
      },
    },
  };

  return (
    <AuthGuard>
      <>{children}</>
      <div className={style.footerWrap} style={{ zIndex: 1 }}>
        {footerArray.map((e, idx) => {
          if (pathStat == e.path) {
            return (
              <motion.div
                className={style.footerItem}
                key={idx}
                variants={variant}
                initial="hidden"
                animate="visible"
              >
                <button className={style.active}>
                  <div className={style.border}></div>
                  <Link href={e.path} className={style.button}>
                    <Icon as={e.icon} />
                  </Link>
                </button>
              </motion.div>
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
