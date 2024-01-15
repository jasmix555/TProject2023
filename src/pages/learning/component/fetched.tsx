import React, { FC } from "react";
import style from "@/styles/learning.module.scss";
import { WordType } from "@/lib/words/words";
import { cubicBezier, motion } from "framer-motion";

interface FetchedProps {
  fetchedWords: WordType[];
}

const Fetched: FC<FetchedProps> = ({ fetchedWords }) => {
  const variant = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1, // Increase delay based on the index
        cubicBezier: cubicBezier(0.42, 0, 0.58, 1),
      },
    }),
  };

  return (
    <>
      <div className={style.title}>
        <h1>登録完了！</h1>
        <p>データが冒険の記録に登録されます。</p>
      </div>

      <div className={style.fetchedWords}>
        {fetchedWords.map((word, index) => (
          <motion.div
            key={index}
            className={style.wordContainer}
            variants={variant}
            initial="hidden"
            animate="visible"
            custom={index} // Pass the index as a custom prop
          >
            <div className={style.text}>
              <div className={style.word}>{word.word}</div>
              <div className={style.genre}>[{word.genre}]</div>
            </div>
            <div className={style.pronunciation}>{word.pronunciation}</div>
            <div className={style.meaning}>{word.meaning}</div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Fetched;
