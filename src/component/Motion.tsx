import { cubicBezier, motion } from "framer-motion";

type MotionProps = {
  children: React.ReactNode;
  delay?: number;
  index?: number; // Add index prop
  classname?: any;
  translate?: number;
  transition?: number;
};

export default function Motion({
  children,
  delay,
  index = 1,
  classname,
  translate,
  transition,
}: MotionProps) {
  const variant = {
    hidden: {
      opacity: 0,
      y: translate || 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: transition || 0.2,
        delay: index * 0.1 + (delay || 0), // Increase delay based on the index and additional delay
        cubicBezier: cubicBezier(0.42, 0, 0.58, 1),
      },
    },
  };

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
      custom={0}
      className={classname}
    >
      {children}
    </motion.div>
  );
}
