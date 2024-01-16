import React, { ChangeEvent, FC, useState, FormEvent, useEffect } from "react";
import style from "@/styles/learning.module.scss";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { words, WordType, languageMap, genreMap } from "@/lib/words/words";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface FetchProps {
  onLanguageChange: (language: string) => void;
  onGenreChange: (genre: string) => void;
  onFormSubmit: (words: WordType[]) => void;
  timestamp?: number;
}

export const Fetch: FC<FetchProps> = ({
  onLanguageChange,
  onGenreChange,
  onFormSubmit,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [memo, setMemo] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    onLanguageChange(event.target.value);
  };

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
    onGenreChange(event.target.value);
  };

  const handleMemoChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(event.target.value);
  };

  const getWords = (
    language: string,
    genre: string,
    count: number = 4
  ): WordType[] => {
    let filteredWords = words.filter((word) => word.language === language);
    if (genre) {
      // If a genre is selected, filter the words based on the genre
      filteredWords = filteredWords.filter((word) => word.genre === genre);
    }

    const fetchedWords = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const randomWord = filteredWords[randomIndex];
      fetchedWords.push(randomWord);

      // Remove the fetched word from the filtered words array
      filteredWords.splice(randomIndex, 1);
    }

    return fetchedWords;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fetchedWords = getWords(selectedLanguage, selectedGenre);

    // Create an array of data objects containing words and additional information
    const data = fetchedWords
      .filter((word) => word && word.word) // Filter out items without 'word' property
      .map((word) => ({
        language: word.language || "",
        word: word.word || "", // Provide a default value if 'word' is undefined
        meaning: word.meaning || "",
        genre: word.genre || "",
        pronunciation: word.pronunciation || "",
        timestamp: Date.now(),
        key: Math.random().toString(36), // Generate a random key for React
      }));

    // Use Firebase to save the data into the Firestore database under the specific user
    try {
      if (!user) {
        return;
      }
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, user.uid);

      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the user document exists, update the dictionary field without overwriting existing messages
        await updateDoc(userDocRef, {
          dictionary: arrayUnion(...data), // This will add new items to the array without overwriting existing ones
        });
      } else {
        // If the user document doesn't exist, create a new one with the dictionary field
        await setDoc(userDocRef, {
          dictionary: data,
        });
      }
    } catch (error) {
      console.error("Error saving learned words:", error);
    }

    onFormSubmit(fetchedWords);
  };

  return (
    <>
      <div className={style.title}>
        <h1>新しい単語を見つけにいこう</h1>
        <p>
          次の日
          <span>(8:30am)</span>
          に新しい単語を教えてくれるよ！
          <br />
          新しい単語を見つける旅に出よう！
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={style.contentWrapper}>
          <div className={style.frame}></div>
          <div className={`${style.content} ${style.caret}`}>
            <label htmlFor="language">言語</label>
            <select
              required
              id="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="" disabled className={style.disabled}>
                選択してください
              </option>
              {Object.keys(languageMap).map((language) => (
                <option key={language} value={language}>
                  {languageMap[language]}
                </option>
              ))}
            </select>
          </div>

          <div className={`${style.content} ${style.caret}`}>
            <label htmlFor="genre">ジャンル</label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="" disabled>
                選択してください
              </option>
              {Object.keys(genreMap).map((genre) => (
                <option key={genre} value={genre}>
                  {genreMap[genre]}
                </option>
              ))}
            </select>
          </div>

          <div className={style.content}>
            <label htmlFor="memo">メモ</label>
            <textarea
              id="memo"
              value={memo}
              onChange={handleMemoChange}
              placeholder="例：方言を教えてください"
            />
          </div>

          <button type="submit" className={style.submit}>
            学びに行く
            <span>
              <MdOutlineKeyboardDoubleArrowRight />
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default Fetch;
