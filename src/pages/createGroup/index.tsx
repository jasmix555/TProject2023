import { useState } from "react";
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/createChat.module.scss";
import LayoutPage from "@/component/LayoutPage";

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationTime, setExpirationTime] = useState("2"); // Default to 2 hours
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter(); // Initialize the useRouter hook

  const isSubmitDisabled = !title || !description;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const groupsRef = collection(db, "groups");

      const hours = parseInt(expirationTime, 10);
      const expirationTimestamp = Timestamp.fromMillis(
        Date.now() + hours * 60 * 60 * 1000
      );

      try {
        const newGroupRef = await addDoc(groupsRef, {
          creatorId: user.uid,
          title,
          description,
          expirationTime: expirationTimestamp,
        });

        // After successfully creating the group, get the generated key
        const groupId = newGroupRef.id;

        // Navigate to the group chat page using the generated group ID
        router.push(`/createdChatGroup/${groupId}`);
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  return (
    <>
      <LayoutPage>
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
      </LayoutPage>
    </>
  );
}
