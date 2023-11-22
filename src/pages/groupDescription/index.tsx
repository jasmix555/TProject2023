import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react"; // Import useState
import style from "@/styles/createGroup.module.scss";
import LayoutPage from "@/component/LayoutPage";
import BackBtn from "@/component/BackBtn";
import Background from "@/component/Background";

export default function GroupDescription() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const { title, description } = router.query;
  const { planet } = router.query;

  const [descriptionValue, setDescriptionValue] = useState(description || ""); // Use state for textarea

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted!");

    if (user) {
      const db = getFirestore();
      const planetGroupsRef = collection(
        db,
        "planets",
        planet as string, // Ensure planet is a string
        "groups"
      );

      try {
        const existingGroupQuery = await getDocs(
          query(
            planetGroupsRef,
            where("title", "==", title),
            where("creatorId", "==", user.uid)
          )
        );

        if (existingGroupQuery.docs.length > 0) {
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
            defaultValue={title}
          />
        </div>
        <div className={style.contentWrap}>
          <p>どんな小惑星か詳しく教えてね！</p>
          <textarea
            className={style.input + " " + style.textarea}
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)} // Add onChange for textarea
          />
        </div>
        <div className={style.buttons}>
          <div className={style.expirationTag}>
            <p>※惑星は6時間経つと消滅してしまうよ!</p>
          </div>
          <button type="submit" className={style.create}>
            着陸する！
          </button>
          <BackBtn link={`/createdGroups?planet=${planet}`} />
        </div>
      </form>
    </LayoutPage>
  );
}
