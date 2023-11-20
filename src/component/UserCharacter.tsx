// components/UserCharacterPage.js
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { getAuth, User } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore/lite";
import Image from "next/image";
import style from "@/styles/userCharacter.module.scss";
import Link from "next/link";

export default function UserCharacter() {
  const [character, setCharacter] = useState(null);
  const toast = useToast();

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
            toast({
              title: "Error",
              description: "User character data not found.",
              status: "error",
              position: "top",
            });
          }
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch user character data.",
          status: "error",
          position: "top",
        });
      }
    };

    fetchUserData();
  }, [toast]);

  return (
    <div className={style.characterWrap}>
      <div className={style.character}>
        {character && (
          <Link href={"/charSelect"}>
            <Image
              src={`/characters/Char${character}L.svg`}
              alt={`UserCharacter ${character}`}
              width={200}
              height={200}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
