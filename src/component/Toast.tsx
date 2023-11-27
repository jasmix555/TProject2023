import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "@/styles/toast.module.scss";

export type ToastProps = {
  message: string;
  status: "success" | "error" | "warning" | "info";
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, status, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    onClose(); // Close the toast as soon as the animation completes
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
