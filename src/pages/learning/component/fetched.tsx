import React, { FC } from "react";
import style from "@/styles/learning.module.scss";
import { WordType } from "@/lib/words/words";
import Motion from "@/component/Motion";

interface FetchedProps {
  fetchedWords: WordType[];
}

const Fetched: FC<FetchedProps> = ({ fetchedWords }) => {
  return (
    <>
      <div className={style.title}>
        <h1>登録完了！</h1>
        <p>データが冒険の記録に登録されます。</p>
      </div>

      <div className={style.fetchedWords}>
        {fetchedWords.map((word, index) => (
          <Motion
            key={index}
            classname={style.wordContainer}
            index={index} // Pass the index as a custom prop
          >
            <div className={style.text}>
              <div className={style.word}>{word.word}</div>
              <div className={style.genre}>[{word.genre}]</div>
            </div>
            <div className={style.pronunciation}>{word.pronunciation}</div>
            <div className={style.meaning}>{word.meaning}</div>
          </Motion>
        ))}
      </div>
    </>
  );
};

export default Fetched;
