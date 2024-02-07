// WordDetails.tsx
import React, { useEffect, useState } from "react";
import { DictionaryEntry } from "./SavedWords";
import style from "@/styles/wordDetails.module.scss";
import {
  FaChevronLeft,
  FaEllipsisH,
  FaSave,
  FaTimes,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Motion from "@/component/Motion";
import { genreMap, languageMap } from "@/utils/words";

type WordDetails = {
  word: string;
  pronunciation: string;
  genre: string;
  meaning: string;
  timestamp: number;
  usage?: string;
  messageKey: string;
  language?: string;
};

interface WordDetailsProps {
  wordInfo: DictionaryEntry;
  onClose: () => void;
  onDelete: () => void; // Add onDelete prop to handle word deletion
  onUpdate: (updatedWord: DictionaryEntry) => void; // Add onUpdate prop to handle word update
  onSave: () => void;
}

const WordDetails: React.FC<WordDetailsProps> = ({
  wordInfo,
  onClose,
  onDelete,
  onUpdate,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<WordDetails>({
    word: wordInfo.word || "",
    pronunciation: wordInfo.pronunciation || "",
    genre: wordInfo.genre || "",
    meaning: wordInfo.meaning || "",
    timestamp: wordInfo.timestamp || 0,
    messageKey: wordInfo.messageKey || "",
    usage: wordInfo.usage || "",
    language: wordInfo.language || "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [saveClicked, setSaveClicked] = useState(false);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const detailsChanged = Object.keys(editedDetails).some((key) => {
        const detailKey = key as keyof WordDetails;
        return (
          detailKey in editedDetails &&
          detailKey in wordInfo &&
          editedDetails[detailKey] !== wordInfo[detailKey]
        );
      });

      if (detailsChanged) {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, user?.uid);

        const userDocSnapshot = await getDoc(userDocRef);
        const currentDictionary = userDocSnapshot.data()?.dictionary || [];

        const updatedDictionary = currentDictionary.map(
          (entry: DictionaryEntry) =>
            entry.messageKey === wordInfo.messageKey ? editedDetails : entry
        );

        await updateDoc(userDocRef, {
          dictionary: updatedDictionary,
        });

        onUpdate(editedDetails);
      }

      setEditing(false);
      setSaveClicked(true);
      onSave();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleEllipsisClick = () => {
    setShowConfirmation(true);
  };

  const handleEditConfirmation = () => {
    setShowConfirmation(false);
    handleEditClick();
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(false);
    onDelete();
  };

  const handleConfirmCancel = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      word: wordInfo.word || "",
      pronunciation: wordInfo.pronunciation || "",
      genre: wordInfo.genre || "",
      meaning: wordInfo.meaning || "",
      timestamp: wordInfo.timestamp || 0,
      messageKey: wordInfo.messageKey || "",
      usage: wordInfo.usage || "",
    }));
  }, [wordInfo, saveClicked]);

  useEffect(() => {
    if (saveClicked) {
      setSaveClicked(false);
    }
  }, [saveClicked]);

  useEffect(() => {
    if (!editing && saveClicked) {
      onClose();
    }
  }, [editing, saveClicked, onClose]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <button onClick={onClose}>
          <FaChevronLeft />
        </button>
        {wordInfo.word && (
          <div className={style.title}>
            {editing ? (
              <div className={style.inputWrapper}>
                <label>
                  単語：
                  <input
                    type="text"
                    name="word"
                    placeholder="単語"
                    value={editedDetails.word}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  発音：
                  <input
                    type="text"
                    name="pronunciation"
                    placeholder="発音"
                    value={editedDetails.pronunciation}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  ジャンル：
                  <select
                    name="genre"
                    aria-placeholder="ジャンル"
                    value={editedDetails.genre}
                    onChange={handleGenreChange}
                  >
                    <option value="">Select Genre</option>
                    {Object.entries(genreMap).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <>
                <h3>{wordInfo.word}</h3>
                <div className={style.details}>
                  {wordInfo.pronunciation && <p>{wordInfo.pronunciation}</p>}
                  {wordInfo.genre && <p>[{genreMap[wordInfo.genre]}]</p>}
                </div>
              </>
            )}
          </div>
        )}
        <button
          onClick={showConfirmation ? handleConfirmCancel : handleEllipsisClick}
        >
          {showConfirmation ? <FaTimes /> : <FaEllipsisH />}
        </button>
      </div>
      <div className={style.contentWrapper}>
        <div className={style.content}>
          <h3>意味</h3>
          {!wordInfo.meaning}
          {editing ? (
            <textarea
              name="meaning"
              placeholder="意味入力してください。。。"
              value={editedDetails.meaning}
              onChange={handleInputChange}
            />
          ) : (
            <li>{wordInfo.meaning || "No Data Found."}</li>
          )}
        </div>
        <div className={style.content}>
          <h3>使い方</h3>
          {!wordInfo.usage}
          {editing ? (
            <textarea
              name="usage"
              placeholder="使い方入力してください。。。"
              value={editedDetails.usage}
              onChange={handleInputChange}
            />
          ) : (
            <li>{wordInfo.usage || "No Data Found."}</li>
          )}
        </div>
        {wordInfo.timestamp && (
          <div className={style.content}>
            <h3>情報</h3>
            <div className={style.time}>
              {editing ? (
                <p>登録日 : {formatDate(editedDetails.timestamp)}</p>
              ) : (
                <p>登録日 : {formatDate(wordInfo.timestamp)}</p>
              )}
            </div>
          </div>
        )}
        {editing && (
          <Motion classname={style.editButtons}>
            <button onClick={handleSaveClick}>
              <span>
                <FaSave />
              </span>
              Save
            </button>
            <button onClick={handleCancelClick}>
              <span>
                <FaTimes />
              </span>
              Cancel
            </button>
          </Motion>
        )}
      </div>
      {showConfirmation && (
        <Motion
          classname={style.confirmationDialog}
          translate={-40}
          transition={0.1}
        >
          <button onClick={handleDeleteConfirmation} className={style.delete}>
            Delete
            <span>
              <FaTrash />
            </span>
          </button>
          <button onClick={handleEditConfirmation}>
            Edit
            <span>
              <FaEdit />
            </span>
          </button>
        </Motion>
      )}
    </div>
  );
};

export default WordDetails;
