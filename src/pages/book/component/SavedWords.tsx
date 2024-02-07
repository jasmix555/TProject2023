import React, { useEffect, useState } from "react";
import style from "@/styles/book.module.scss";
import WordDetails from "./WordDetails";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { FaChevronRight } from "react-icons/fa";

export interface DictionaryEntry {
  saved?: boolean;
  timestamp: number;
  language?: string;
  word?: string;
  meaning?: string;
  pronunciation?: string;
  genre?: string;
  messageKey?: string;
  usage?: string;
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
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [resetDataChanged, setResetDataChanged] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false); // Add this line

  const handleMoreClick = (wordInfo: DictionaryEntry) => {
    setSelectedWord(wordInfo);
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
                <p className={style.text}>{entry.word}</p>
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

  const handleUpdate = async (updatedWord: DictionaryEntry) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      // Fetch user document
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const dictionary: DictionaryEntry[] = userData?.dictionary || [];

        // Find the index of the word to be updated
        const wordIndex = dictionary.findIndex(
          (entry) => entry.messageKey === updatedWord.messageKey
        );

        if (wordIndex !== -1) {
          // Update the word in the dictionary array
          dictionary[wordIndex] = updatedWord;

          // Update the user document with the modified dictionary
          await setDoc(userDoc, { dictionary }, { merge: true });
        }
      }
      setDataChanged(true);

      setForceUpdate((prev) => !prev);
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      // Fetch user document
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const dictionary: DictionaryEntry[] = userData?.dictionary || [];

        // Find the index of the word/message to be deleted
        const wordToDelete = selectedWord?.word;
        const updatedDictionary = dictionary.filter(
          (entry) =>
            entry.word !== wordToDelete && entry.messageKey !== wordToDelete
        );

        // Update the user document with the modified dictionary
        await setDoc(
          userDoc,
          { dictionary: updatedDictionary },
          { merge: true }
        );
        setSelectedWord(null); // Close the WordDetails component after deleting
        setResetDataChanged(true);
        setForceUpdate((prev) => !prev); // Trigger a re-render
      }
      setDataChanged(true);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const handleSaveChange = () => {
    setDataChanged(true);
  };

  useEffect(() => {
    fetchSavedInfo(date || null);
  }, [date, userId, dataChanged, resetDataChanged, forceUpdate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setResetDataChanged(false);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timeoutId);
  }, [resetDataChanged]);

  return (
    <div className={style.messagesWrap}>
      <div className={style.messagesWrap}>
        {loading ? (
          <p>Loading...</p>
        ) : selectedWord ? (
          <WordDetails
            key={selectedWord ? selectedWord.messageKey : "defaultKey"}
            wordInfo={selectedWord}
            onClose={() => setSelectedWord(null)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSave={handleSaveChange}
          />
        ) : savedMessages.length > 0 ? (
          <>{savedMessages}</>
        ) : (
          <p>No saved messages found.</p>
        )}
      </div>
    </div>
  );
}
