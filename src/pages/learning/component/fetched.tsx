import React, { FC } from "react";
import style from "@/styles/learning.module.scss";
import { WordType } from "@/lib/words/words";

interface FetchedProps {
  fetchedWords: WordType[];
}

const Fetched: FC<FetchedProps> = ({ fetchedWords }) => {
  return (
    <>
      <div className={style.title}>
        <h1>学んでいます...</h1>
        <p>以下はあなたの新しい単語です：</p>
      </div>

      <div className={style.fetchedWords}>
        {fetchedWords.map((word, index) => (
          <div key={index} className={style.wordContainer}>
            <div className={style.text}>
              <div className={style.word}>{word.word}</div>
              <div className={style.genre}>[{word.genre}]</div>
            </div>
            <div className={style.pronunciation}>{word.pronunciation}</div>
            <div className={style.meaning}>{word.meaning}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Fetched;
