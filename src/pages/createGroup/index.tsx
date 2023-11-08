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
import BackBtn from "@/component/BackBtn";

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationTime, setExpirationTime] = useState("2"); // Default to 2 hours
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter(); // Initialize the useRouter hook

  const isSubmitDisabled = !title || title.length < 5 || !description;

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
        router.push(`/groupChat`);
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  return (
    <>
      <LayoutPage>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.contentWrap}>
            <p>あなただけの小惑星の名前を決めてね！</p>
            <input
              className={style.input + " " + style.title}
              type="text"
              placeholder="タイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={style.contentWrap}>
            <p>どんな小惑星か詳しく教えてね！</p>
            <textarea
              className={style.input + " " + style.textarea}
              placeholder="例）新しく覚えた単語をみんなに披露したい！！単語の意味やスラングがわからないから教えて欲しい！コミュニケーションをしたい！"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={style.contentWrap}>
            <p>Group Expiration Time:</p>
            <select
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className={style.input + " " + style.select}
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
          <div className={style.buttons}>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={style.create}
            >
              惑星をつくる
            </button>
            <BackBtn link={"/createdGroups"} />
          </div>
        </form>
      </LayoutPage>
    </>
  );
}
