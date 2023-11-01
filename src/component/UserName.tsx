import style from "@/styles/username.module.scss";
import { useState, useEffect } from "react";
import { getAuth, User } from "firebase/auth";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore/lite";

export default function UserName() {
  const [nickname, setNickname] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const db: Firestore = getFirestore();

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (user) {
        // Replace 'users' with the actual collection name where user data is stored
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            if (userData && userData.nickname && userData.language) {
              setNickname(userData.nickname);
              setLanguage(userData.language);
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
    <>
      <div className={style.wrapper}>
        <div className={style.background}></div>
        <div>
          <h1>{nickname ? `${nickname}` : "No Internet"}</h1>
        </div>
        <div>
          <h1>勉強中： {language ? `${language}` : " "}</h1>
        </div>
      </div>
    </>
  );
}
