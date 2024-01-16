// WordDetails.tsx

import React from "react";
import { DictionaryEntry } from "./SavedWords";

interface WordDetailsProps {
  wordInfo: DictionaryEntry;
  onClose: () => void;
}

const WordDetails: React.FC<WordDetailsProps> = ({ wordInfo, onClose }) => {
  return (
    <div>
      <h2>{wordInfo.word}</h2>
      <p>{wordInfo.meaning}</p>
      <p>{wordInfo.genre}</p>
      <p>{wordInfo.pronunciation}</p>
      <p>{wordInfo.timestamp}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default WordDetails;
