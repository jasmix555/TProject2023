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

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationTime, setExpirationTime] = useState("2");
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const { planet } = router.query;

  const isSubmitDisabled = !title || title.length < 5 || !description;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const planetGroupsRef = collection(
        db,
        "planets",
        planet as string,
        "groups"
      );

      const hours = parseInt(expirationTime, 10);
      const expirationTimestamp = Timestamp.fromMillis(
        Date.now() + hours * 60 * 60 * 1000
      );

      try {
        const newGroupRef = await addDoc(planetGroupsRef, {
          creatorId: user.uid,
          title,
          description,
          expirationTime: expirationTimestamp,
          createdAt: Timestamp.now(),
        });

        const groupId = newGroupRef.id;

        // Navigate to the group description page using the generated groupId
        router.push({
          pathname: `/groupDescription`,
          query: {
            groupId,
            planet,
          },
        });
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  return (
    <LayoutPage>
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.contentWrap}>
          <p>タイトル</p>
          <input
            className={style.input + " " + style.title}
            type="text"
            placeholder="タイトルを入力してください..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={style.contentWrap}>
          <p>詳細</p>
          <textarea
            className={style.input + " " + style.textarea}
            placeholder="詳細を入力してください..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={style.buttons}>
          <div className={style.expirationTag}>
            <p>※惑星は6時間経つと消滅してしまうよ!</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={style.create}
          >
            ここに展開する！
          </button>
          <BackBtn link={`/createdGroups?planet=${planet}`} />
        </div>
      </form>
    </LayoutPage>
  );
}
