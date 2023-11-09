import { useState } from "react";
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/createGroup.module.scss";
import LayoutPage from "@/component/LayoutPage";
import BackBtn from "@/component/BackBtn";

export default function GroupDescription() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter(); // Initialize the useRouter hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const groupsRef = collection(db, "groups");

      try {
        const newGroupRef = await addDoc(groupsRef, {
          creatorId: user.uid,
          title,
          description,
        });

        // After successfully creating the group, get the generated key
        const groupId = newGroupRef.id;

        // Navigate to the group chat page using the generated group ID
        router.push(`/groupChat`);
      } catch (error) {
        console.error("Error joining group:", error);
      }
    }
  };

  return (
    <>
      <LayoutPage>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.contentWrap}>
            <p>この小惑星の名前</p>
            <input
              className={style.input + " " + style.title}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={style.contentWrap}>
            <p>どんな小惑星か詳しく教えてね！</p>
            <textarea
              className={style.input + " " + style.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={style.buttons}>
            <div className={style.expirationTag}>
              <p>※惑星は6時間経つと消滅してしまうよ!</p>
            </div>
            <button type="submit" className={style.create}>
              着陸する！
            </button>
            <BackBtn link={"/createdGroups"} />
          </div>
        </form>
      </LayoutPage>
    </>
  );
}
