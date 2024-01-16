// SavedWords.tsx

import React, { useEffect, useState } from "react";
import style from "@/styles/book.module.scss";
import WordDetails from "./WordDetails";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { FaChevronRight } from "react-icons/fa";

export interface DictionaryEntry {
  message: string;
  saved: boolean;
  timestamp: number;
  languages: string[];
  word: string;
  meaning?: string;
  pronunciation?: string;
  genre?: string;
}

type Props = {
  date?: Date | null;
  userId: string;
};

export default function SavedWords({ date, userId }: Props) {
  const [savedMessages, setSavedMessages] = useState<JSX.Element[]>([]);
  const [prevDate, setPrevDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(
    null
  );

  const handleMoreClick = (wordInfo: DictionaryEntry) => {
    setSelectedWord(wordInfo);
  };

  const handleCloseClick = () => {
    setSelectedWord(null);
  };

  const fetchSavedInfo = async (selectedDate: Date | null) => {
    try {
      setLoading(true);

      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const dictionary: DictionaryEntry[] = userData?.dictionary || [];
        const sortedDictionary = dictionary.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const savedWords = sortedDictionary.map(
          (entry: DictionaryEntry, index) => {
            const wordDate = new Date(entry.timestamp);
            wordDate.setHours(0, 0, 0, 0);
            const isNew = wordDate.getTime() === today.getTime();
            const dateChanged =
              prevDate !== null && wordDate.getTime() !== prevDate.getTime();
            const updatedIsNew = dateChanged ? false : isNew;
            const messageClass = updatedIsNew
              ? `${style.message} ${style.new}`
              : style.message;

            return (
              <div key={`SavedMessage_${index}`} className={messageClass}>
                <p className={style.text}>{entry.message || entry.word}</p>
                {updatedIsNew && <div className={style.newLabel}>New!</div>}
                <button
                  className={style.more}
                  onClick={() => handleMoreClick(entry)}
                >
                  <FaChevronRight />
                </button>
              </div>
            );
          }
        );

        setSavedMessages(savedWords);
        setPrevDate(today);
      } else {
        console.error("User document not found for userId:", userId);
      }
    } catch (error) {
      console.error("Error fetching saved messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedInfo(date || null);
  }, [date, userId]);

  return (
    <div className={style.messagesWrap}>
      <div className={style.messagesWrap}>
        {loading ? (
          <p>Loading...</p>
        ) : selectedWord ? (
          <WordDetails wordInfo={selectedWord} onClose={handleCloseClick} />
        ) : savedMessages.length > 0 ? (
          <>{savedMessages}</>
        ) : (
          <p>No saved messages found.</p>
        )}
      </div>
    </div>
  );
}
