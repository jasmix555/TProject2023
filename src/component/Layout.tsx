import style from "@/styles/Footer.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import { footerArray } from "@/lib/nav/footerTypes";
import { Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Header from "./Header";
import MenuBar from "./MenuBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [pathStat, setPathStat] = useState("/");

  useEffect(() => {
    if (location.pathname == "/") {
      setPathStat("/");
    } else if (location.pathname == "/book") {
      setPathStat("/book");
    } else if (location.pathname == "/home") {
      setPathStat("/home");
    } else if (location.pathname == "/chat") {
      setPathStat("/chat");
    } else {
      setPathStat("/");
    }
  }, []);

  return (
    <>
      <motion.div className={style.divWrap}>
        <motion.main
          initial={{ opacity: 0, transform: "translateX(100)" }} //初期状態
          animate={{ opacity: 1, transform: "translateX(0)" }} //マウント
          exit={{ opacity: 0, transform: "translateX(100)" }} //アンマウント
        >
          {children}
        </motion.main>
      </motion.div>
      <div className={style.footerWrap}>
        {footerArray.map((e, idx) => {
          if (pathStat == e.path) {
            // console.log("success");
            return (
              <div className={style.footerItem} key={idx}>
                <button className={style.active}>
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

// export default function Footer() {
//   return (
//     <>
//       <div className={style.footerWrap}>
//         <div className={style.bookWrap}>
//           <button>
//             <FaBook />
//           </button>
//         </div>
//         <div className={style.rocketWrap}>
//           <button>
//             <FaRocket />
//           </button>
//         </div>
//         <div className={style.chatWrap}>
//           <button>
//             <Link href="/chat">
//               <FaRocketchat />
//             </Link>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
