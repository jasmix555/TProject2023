import { useState, useEffect, FormEvent } from "react";
import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/charSelect.module.scss";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { getAuth, User } from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  Firestore,
  getDoc,
} from "firebase/firestore/lite";
import { FirebaseError } from "@firebase/util";

// ... (your existing imports)

export default function CharSelect() {
  const [currentChar, setCurrentChar] = useState(1);
  const totalChars = 5;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const auth = getAuth();
      const user: User | null = auth.currentUser;

      if (user) {
        const db: Firestore = getFirestore();

        const usersCollection = collection(db, "users");

        const userDocRef = doc(usersCollection, user.uid);

        // Fetch existing user data
        const existingUserData = (await getDoc(userDocRef)).data();

        // Create new user data with the existing fields and the new character field
        const userData = {
          ...existingUserData,
          character: currentChar,
        };

        await setDoc(userDocRef, userData);

        // Check if necessary fields exist in the user profile
        if (
          userData &&
          "name" in userData &&
          "nickname" in userData &&
          "language" in userData
        ) {
          router.push("/");
        } else {
          router.push("/profile-setup");
        }
      } else {
        toast({
          title: "Error",
          description: "No authenticated user found.",
          status: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: (error as FirebaseError).message,
        status: "error",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const preloadImages = () => {
      const nextImage = new window.Image();
      nextImage.src = `/characters/Char${
        currentChar === totalChars ? 1 : currentChar + 1
      }M.svg`;

      const prevImage = new window.Image();
      prevImage.src = `/characters/Char${
        currentChar === 1 ? totalChars : currentChar - 1
      }M.svg`;
    };

    preloadImages();
  }, [currentChar, totalChars]);

  const goLeft = () => {
    setCurrentChar(currentChar === 1 ? totalChars : currentChar - 1);
  };

  const goRight = () => {
    setCurrentChar(currentChar === totalChars ? 1 : currentChar + 1);
  };

  return (
    <LayoutPage>
      <div className={style.header}>
        <h1>アバター選択</h1>
      </div>
      <div className={style.carouselWrapper}>
        <div className={style.characterWrap}>
          <div className={style.previous}>
            <Image
              src={`/characters/Char${
                currentChar === 1 ? totalChars : currentChar - 1
              }M.svg`}
              alt="previous character"
              width={141}
              height={200}
            />
          </div>
          <div className={style.current}>
            <Image
              src={`/characters/Char${currentChar}L.svg`}
              alt="current character"
              width={283}
              height={400}
            />
          </div>
          <div className={style.next}>
            <Image
              src={`/characters/Char${
                currentChar === totalChars ? 1 : currentChar + 1
              }M.svg`}
              alt="next character"
              width={141}
              height={200}
            />
          </div>
        </div>

        <div className={style.carouselBtnWrapper}>
          <button onClick={goLeft} className={`${style.button} ${style.left}`}>
            <i className={style.icon}>
              <FaChevronLeft />
            </i>
          </button>
          <button
            onClick={goRight}
            className={`${style.button} ${style.right}`}
          >
            <i className={style.icon}>
              <FaChevronRight />
            </i>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={style.select}
          >
            {isLoading ? "設定中" : "決定！"}
          </button>
        </div>
      </div>
    </LayoutPage>
  );
}
