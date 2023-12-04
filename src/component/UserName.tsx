import style from "@/styles/username.module.scss";
import { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { CircleFlag } from "react-circle-flags";

export default function UserName() {
  const [nickname, setNickname] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const db: Firestore = getFirestore();

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            console.log(userData); // Log the user data

            if (userData) {
              if (userData.nickname) {
                setNickname(userData.nickname);
              }

              if (userData.languages) {
                // Convert the languages array to a string
                const languagesString = userData.languages.join(", ");
                setLanguages(languagesString);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserNickname();
  }, [user, db]);

  return (
    <div className={style.wrapper}>
      <div>
        <h1>{nickname ? `${nickname}` : "Username Not Found"}</h1>
      </div>
      <div className={style.languages}>
        <h1 className={style.langWrap}>
          勉強中：
          {languages.split(",").map((languageCode: string, idx) => {
            return (
              <span key={idx}>
                <CircleFlag countryCode={languageCode.trim()} width="30" />
              </span>
            );
          })}
        </h1>
      </div>
    </div>
  );
}
