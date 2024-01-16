// WordDetails.tsx
import React from "react";
import { DictionaryEntry } from "./SavedWords";
import style from "./wordDetails.module.scss";
import { FaChevronLeft, FaEllipsisH } from "react-icons/fa";

interface WordDetailsProps {
  wordInfo: DictionaryEntry;
  onClose: () => void;
}

const WordDetails: React.FC<WordDetailsProps> = ({ wordInfo, onClose }) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div className={style.header}>
        <button onClick={onClose}>
          <FaChevronLeft />
        </button>
        {wordInfo.word && (
          <div className={style.title}>
            <h3>{wordInfo.word}</h3>
            <div className={style.details}>
              {wordInfo.pronunciation && <p>{wordInfo.pronunciation}</p>}
              {wordInfo.genre && <p>[{wordInfo.genre}]</p>}
            </div>
          </div>
        )}
        <button>
          <FaEllipsisH />
        </button>
      </div>
      {wordInfo.meaning && (
        <div className={style.wrapper}>
          <h3>意味</h3>
          <div className={style.content}>
            <p>・{wordInfo.meaning}</p>
          </div>
        </div>
      )}
      {wordInfo.timestamp && (
        <div className={style.wrapper}>
          <h3>情報</h3>
          <div className={style.time}>
            <p>登録日 : {formatDate(wordInfo.timestamp)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default WordDetails;
