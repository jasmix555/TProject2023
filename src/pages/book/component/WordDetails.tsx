// WordDetails.tsx
import React, { useEffect, useState } from "react";
import { DictionaryEntry } from "./SavedWords";
import style from "./wordDetails.module.scss";
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

type WordDetails = {
  word: string;
  message: string;
  pronunciation: string;
  genre: string;
  meaning: string;
  timestamp: number;
  usage?: string;
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
  const [editedDetails, setEditedDetails] = useState({
    word: wordInfo.word || "",
    message: wordInfo.message || "",
    pronunciation: wordInfo.pronunciation || "",
    genre: wordInfo.genre || "",
    meaning: wordInfo.meaning || "",
    timestamp: wordInfo.timestamp || 0,
    messageKey: wordInfo.messageKey || "",
    usage: wordInfo.usage || "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [saveClicked, setSaveClicked] = useState(false); // Add a state for save button click

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Check if any of the details have changed
      const detailsChanged = Object.keys(editedDetails).some((key) => {
        const detailKey = key as keyof WordDetails;
        return (
          detailKey in editedDetails &&
          detailKey in wordInfo &&
          editedDetails[detailKey] !== wordInfo[detailKey]
        );
      });

      if (detailsChanged) {
        // Update the document in Firebase Firestore
        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, user?.uid);

        // Fetch the current dictionary data
        const userDocSnapshot = await getDoc(userDocRef);
        const currentDictionary = userDocSnapshot.data()?.dictionary || [];

        // Create a new array with the updated word and other unchanged words
        const updatedDictionary = currentDictionary.map(
          (entry: DictionaryEntry) =>
            entry.messageKey === wordInfo.messageKey ? editedDetails : entry
        );

        // Update the Firestore document with the modified dictionary
        await updateDoc(userDocRef, {
          dictionary: updatedDictionary,
        });

        onUpdate(editedDetails); // Pass the updated details to the parent component
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
    // Optionally, you can reset editedDetails to the original details here
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
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Update editedDetails when wordInfo changes
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      word: wordInfo.word || "",
      message: wordInfo.message || "",
      pronunciation: wordInfo.pronunciation || "",
      genre: wordInfo.genre || "",
      meaning: wordInfo.meaning || "",
      timestamp: wordInfo.timestamp || 0,
    }));
  }, [wordInfo, saveClicked]); // Add saveClicked as a dependency

  // Reset saveClicked state after useEffect runs
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
              <>
                <input
                  type="text"
                  name="word"
                  value={editedDetails.word}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="pronunciation"
                  value={editedDetails.pronunciation}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="genre"
                  value={editedDetails.genre}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              <>
                <h3>{wordInfo.word}</h3>
                <div className={style.details}>
                  {wordInfo.pronunciation && <p>{wordInfo.pronunciation}</p>}
                  {wordInfo.genre && <p>[{wordInfo.genre}]</p>}
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
        {!wordInfo.meaning && !wordInfo.usage && (
          <div className={style.content}>
            <h3>意味</h3>
            {editing ? (
              <textarea
                name="meaning"
                value={"No Data Found."}
                onChange={handleInputChange}
              />
            ) : (
              <li>No Data Found.</li>
            )}
          </div>
        )}
        {wordInfo.meaning && (
          <div className={style.content}>
            <h3>意味</h3>
            {editing ? (
              <textarea
                name="meaning"
                value={editedDetails.meaning}
                onChange={handleInputChange}
              />
            ) : (
              <li>{wordInfo.meaning}</li>
            )}
          </div>
        )}
        <div className={style.content}>
          <h3>使い方</h3>
          <p>Word Usage</p>
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
      </div>
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
