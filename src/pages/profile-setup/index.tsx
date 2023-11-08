import { useState, FormEvent } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import style from "@/styles/form.module.scss";
import { getAuth, User } from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  Firestore,
} from "firebase/firestore/lite";
import { FirebaseError } from "@firebase/util";
import LayoutPage from "@/component/LayoutPage";

export default function ProfileSetup() {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const user: User | null = auth.currentUser;

      if (user) {
        const db: Firestore = getFirestore();

        // Create a reference to the "users" collection using the Firestore instance
        const usersCollection = collection(db, "users");

        // Replace 'user.uid' with the actual user identifier (e.g., email or unique ID)
        const userDocRef = doc(usersCollection, user.uid);

        const userData = {
          name,
          nickname,
          language,
          // Add other user profile data here
        };

        await setDoc(userDocRef, userData);

        // User profile data setup successful, redirect to the home page
        router.push("/");
      } else {
        // Handle the case when there's no authenticated user
        toast({
          title: "Profile Setup Error",
          description: "No authenticated user found.",
          status: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Profile Setup Error",
        description: (error as FirebaseError).message,
        status: "error",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutPage>
      <div className={style.bodyWrap}>
        <form onSubmit={handleSubmit}>
          <div className={style.contentWrap}>
            <div className={style.inputWrap}>
              <p>Name</p>
              <input
                className={style.input}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={style.inputWrap}>
              <p>Nickname</p>
              <input
                className={style.input}
                type="text"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className={style.inputWrap}>
              <p>Language Preference</p>
              <input
                className={style.input}
                type="text"
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                // Add more fields for additional user profile data as needed
              />
            </div>
          </div>
          <div className={style.submitWrap}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Setting Up..." : "Save User Info"}
            </button>
          </div>
        </form>
      </div>
    </LayoutPage>
  );
}
