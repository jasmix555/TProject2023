// UserCharacter.tsx
import { useEffect, useState } from "react";
import { getAuth, User } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore/lite";
import Image from "next/image";
import style from "@/styles/userCharacter.module.scss";
import Link from "next/link";

export default function UserCharacter() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user: User | null = auth.currentUser;

        if (user) {
          const db = getFirestore();
          const usersCollection = collection(db, "users");
          const userDocRef = doc(usersCollection, user.uid);
          const userData = (await getDoc(userDocRef)).data();

          if (userData && userData.character) {
            setCharacter(userData.character);
          } else {
            console.error("User data not found");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.characterWrap}>
      <div className={style.character}>
        {character && (
          <Link href={"/charSelect"}>
            <Image
              src={`/characters/${character}.svg`}
              alt={`UserCharacter ${character}`}
              width={200}
              height={200}
              priority
            />
          </Link>
        )}
      </div>
    </div>
  );
}
