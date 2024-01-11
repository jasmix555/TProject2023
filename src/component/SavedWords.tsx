import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import style from "@/styles/book.module.scss";

// Define an interface for the dictionary entry
interface DictionaryEntry {
  message: string;
  saved: boolean;
  timestamp: number;
  languages: string[];
}
type Props = {
  date?: Date | null;
  userId: string;
};

export default function SavedWords({ date, userId }: Props) {
  const [savedMessages, setSavedMessages] = useState<JSX.Element[]>([]);
  const [prevDate, setPrevDate] = useState<Date | null>(null);

  // Fetch saved messages for the selected date
  const fetchSavedInfo = async (selectedDate: Date | null) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      // Check if user document exists
      const userDocSnapshot = await getDoc(userDoc);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Annotate the type of dictionary entries
        const dictionary: DictionaryEntry[] = userData?.dictionary || [];

        // Get today's date for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Extract saved messages from the dictionary
        const savedWords = dictionary
          .filter((entry: DictionaryEntry) => entry.saved === true)
          .map((entry: DictionaryEntry, index) => {
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
                <p className={style.text}>{entry.message}</p>
                {updatedIsNew && <div className={style.newLabel}>New!</div>}
                <button className={style.edit}>{">"}</button>
              </div>
            );
          });

        setSavedMessages(savedWords);
        setPrevDate(today); // Update the previous date
      } else {
        console.error("User document not found for userId:", userId);
      }
    } catch (error) {
      console.error("Error fetching saved messages:", error);
    }
  };

  useEffect(() => {
    fetchSavedInfo(date || null);
  }, [date, userId]); // Call fetchSavedInfo whenever date or userId changes

  return (
    <div className={style.messagesWrap}>
      <div>
        {
          // Display saved messages
          savedMessages.map((message, index) => message)
        }
      </div>
    </div>
  );
}
