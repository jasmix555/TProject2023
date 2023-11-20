import { useState, useEffect } from "react";
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/createGroup.module.scss";
import LayoutPage from "@/component/LayoutPage";
import BackBtn from "@/component/BackBtn";
import Background from "@/component/Background";

export default function GroupDescription() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const { title, description } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const groupsRef = collection(db, "groups");

      try {
        // Check if the group already exists with the given title and creatorId
        const existingGroupQuery = await getDocs(
          query(
            groupsRef,
            where("title", "==", title),
            where("creatorId", "==", user.uid)
          )
        );

        if (existingGroupQuery.docs.length > 0) {
          // Group already exists, navigate to the group chat page
          const existingGroupId = existingGroupQuery.docs[0].id;
          router.push({
            pathname: `/groupChat`,
            query: {
              title,
              description,
              groupId: existingGroupId,
            },
          });
        }
      } catch (error) {
        console.error("Error creating or navigating to the group:", error);
      }
    }
  };

  return (
    <LayoutPage>
      <Background />
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.contentWrap}>
          <p>タイトル</p>
          <input
            disabled
            className={style.input + " " + style.title}
            type="text"
            value={title}
          />
        </div>
        <div className={style.contentWrap}>
          <p>どんな小惑星か詳しく教えてね！</p>
          <textarea
            className={style.input + " " + style.textarea}
            value={description}
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
  );
}
