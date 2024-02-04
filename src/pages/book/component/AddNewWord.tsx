import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaSave, FaTimes } from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { DictionaryEntry } from "./SavedWords";
import style from "@/styles/addWords.module.scss";

// Import the language and genre maps
import { languageMap, genreMap } from "@/utils/words";

interface AddNewWordProps {
  onAddNewWord: (newWord: DictionaryEntry) => void;
  onClose: () => void;
}

const AddNewWord: React.FC<AddNewWordProps> = ({ onAddNewWord, onClose }) => {
  const initialWordState = {
    word: "",
    pronunciation: "",
    genre: "",
    meaning: "",
    usage: "",
    language: "",
  };

  const [newWord, setNewWord] = useState(initialWordState);
  const [saveClicked, setSaveClicked] = useState(false);
  const [authError, setAuthError] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewWord((prevWord) => ({
      ...prevWord,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setNewWord(initialWordState);
    setAuthError("");
  };

  const handleSaveClick = async () => {
    try {
      // Basic validation - ensure required fields are filled
      if (!newWord.word || !newWord.meaning) {
        setAuthError("単語と意味は必須です");
        return;
      }

      // Save the new word to Firestore
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, user?.uid);

      const userDocSnapshot = await getDoc(userDocRef);
      const currentDictionary = userDocSnapshot.data()?.dictionary || [];

      const newEntry = {
        ...newWord,
        timestamp: Date.now(),
        messageKey: Math.random().toString(36),
      };

      const updatedDictionary = [...currentDictionary, newEntry];

      await setDoc(
        userDocRef,
        { dictionary: updatedDictionary },
        { merge: true }
      );

      onAddNewWord(newEntry);
      setSaveClicked(true);
      resetForm(); // Reset the form after successfully adding a new word
    } catch (error) {
      console.error("Error saving document:", error);
      setAuthError("An error occurred while saving the new word");
    }
  };

  useEffect(() => {
    if (saveClicked) {
      onClose();
    }
  }, [saveClicked, onClose]);

  return (
    <div className={style.wrapper}>
      <button onClick={onClose}>
        <FaChevronLeft />
      </button>
      <div className={style.contentWrapper}>
        <label>
          単語:
          <input
            type="text"
            name="word"
            value={newWord.word}
            onChange={handleInputChange}
          />
        </label>
        <label>
          意味:
          <input
            name="meaning"
            value={newWord.meaning}
            onChange={handleInputChange}
          />
        </label>
        <label>
          発音:
          <input
            type="text"
            name="pronunciation"
            value={newWord.pronunciation}
            onChange={handleInputChange}
          />
        </label>
        <label>
          言語:
          <select
            name="language"
            value={newWord.language}
            onChange={handleInputChange}
          >
            <option value="">Select Language</option>
            {Object.entries(languageMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          ジャンル:
          <select
            name="genre"
            value={newWord.genre}
            onChange={handleInputChange}
          >
            <option value="">Select Genre</option>
            {Object.entries(genreMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          使い方:
          <input
            name="usage"
            value={newWord.usage}
            onChange={handleInputChange}
          />
        </label>
        {authError && <p>{authError}</p>}
      </div>
      <div className={style.buttons}>
        <button onClick={handleSaveClick}>
          <span>
            <FaSave />
          </span>
          Save
        </button>
        <button onClick={onClose}>
          <span>
            <FaTimes />
          </span>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddNewWord;
