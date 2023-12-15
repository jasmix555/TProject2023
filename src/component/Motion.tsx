import { motion } from "framer-motion";

export default function Motion({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div style={{ position: "relative" }}>
        <motion.main
          initial={{ opacity: 0, transform: "translateX(100)" }} //初期状態
          animate={{ opacity: 1, transform: "translateX(0)" }} //マウント
          exit={{ opacity: 0, transform: "translateX(100)" }} //アンマウント
        >
          {children}
        </motion.main>
      </motion.div>
    </>
  );
}
