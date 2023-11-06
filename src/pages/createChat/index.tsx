import { useState } from "react";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import style from "@/styles/createChat.module.scss";

export default function CreateChat() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationTime, setExpirationTime] = useState("2"); // Default to 2 hours
  const auth = getAuth();
  const user = auth.currentUser;

  const isSubmitDisabled = !title || !description;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const groupRef = doc(db, "groups", user.uid);

      // Calculate the expiration timestamp based on the selected option
      const hours = parseInt(expirationTime, 10);
      const expirationTimestamp = Timestamp.fromMillis(
        Date.now() + hours * 60 * 60 * 1000
      );

      try {
        await setDoc(groupRef, {
          title,
          description,
          expirationTime: expirationTimestamp,
        });

        alert("Group created successfully");
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={style.form}>
        <div>
          <p>Group Title:</p>
          <input
            type="text"
            placeholder="Enter the group title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <p>Group Description:</p>
          <textarea
            placeholder="Enter the group description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <p>Group Expiration Time:</p>
          <select
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className={style.select}
          >
            <optgroup>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="6">6 hours</option>
              <option value="8">8 hours</option>
              <option value="10">10 hours</option>
              <option value="24">24 hours</option>
            </optgroup>
          </select>
        </div>
        <button type="submit" disabled={isSubmitDisabled}>
          Create Group
        </button>
      </form>
    </>
  );
}
