import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "@/styles/toast.module.scss";

export type ToastProps = {
  message: string;
  status: "success" | "error" | "warning" | "info";
};

const Toast: React.FC<ToastProps> = ({ message, status }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`${style.toast} ${style[status]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
