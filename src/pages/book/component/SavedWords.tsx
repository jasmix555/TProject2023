import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import style from "@/styles/book.module.scss";

// Define an interface for the dictionary entry
interface DictionaryEntry {
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

  // Fetch saved messages for the selected date
  const fetchSavedInfo = async (selectedDate: Date | null) => {
    try {
      setLoading(true);

      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      // Check if user document exists
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Annotate the type of dictionary entries
        const dictionary: DictionaryEntry[] = userData?.dictionary || [];

        // Sort the dictionary array by timestamp in descending order
        const sortedDictionary = dictionary.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        // Get today's date for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Extract saved messages from the dictionary
        const savedWords = sortedDictionary.map(
          (entry: DictionaryEntry, index) => {
            // Check if the word was added today
            const wordDate = new Date(entry.timestamp);
            wordDate.setHours(0, 0, 0, 0);
            const isNew = wordDate.getTime() === today.getTime();

            // Check if the date has changed since the last check
            const dateChanged =
              prevDate !== null && wordDate.getTime() !== prevDate.getTime();

            // Update isNew based on date change
            const updatedIsNew = dateChanged ? false : isNew;

            // Apply the "new" class if the word was added today
            const messageClass = updatedIsNew
              ? `${style.message} ${style.new}`
              : style.message;

            return (
              <div key={`SavedMessage_${index}`} className={messageClass}>
                <p className={style.text}> {entry.message || entry.word}</p>
                {updatedIsNew && <div className={style.newLabel}>New!</div>}
                <button className={style.edit}>{">"}</button>
              </div>
            );
          }
        );

        setSavedMessages(savedWords);
        setPrevDate(today); // Update the previous date
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
  }, [date, userId]); // Call fetchSavedInfo whenever date or userId changes

  return (
    <div className={style.messagesWrap}>
      <div className={style.messagesWrap}>
        {loading ? (
          <p>Loading...</p>
        ) : savedMessages.length > 0 ? (
          <>{savedMessages}</>
        ) : (
          <p>No saved messages found.</p>
        )}
      </div>
    </div>
  );
}
