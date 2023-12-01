import { useToast } from "@chakra-ui/react";
import style from "@/styles/form.module.scss";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
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
import Select from "react-select";
import LayoutPage from "@/component/LayoutPage";

type OptionType = { value: string; label: string };

const Flags = [
  { name: "English", code: "us" },
  { name: "Japanese", code: "jp" },
  { name: "Indonesian", code: "id" },
  { name: "Chinese", code: "cn" },
  { name: "French", code: "fr" },
  { name: "Korean", code: "kr" },
  { name: "Spanish", code: "es" },
];

export default function ProfileSetup() {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<OptionType[]>([]);

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

        const existingUserData = (await getDoc(userDocRef)).data();

        // Convert the selected options to an array of language codes
        const selectedLanguages = languages.map((option) => option.value);

        const userData = {
          ...existingUserData,
          name,
          nickname,
          languages: selectedLanguages, // Add the selected languages here
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
              <p>名前</p>
              <input
                autoComplete="off"
                className={style.input}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={style.inputWrap}>
              <p>ニックネーム</p>
              <input
                autoComplete="off"
                className={style.input}
                type="text"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
            <div className={style.inputWrap}>
              <p>言語</p>
              <Select
                isMulti
                options={[
                  { value: "us", label: "英語" },
                  { value: "jp", label: "日本語" },
                  { value: "id", label: "インドネシア語" },
                  { value: "cn", label: "中国語" },
                  { value: "fr", label: "フランス語" },
                  { value: "kr", label: "韓国語" },
                  { value: "es", label: "スペイン語" },
                ]}
                onChange={(selectedOptions) =>
                  setLanguages(Array.from(selectedOptions))
                }
                value={languages}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "var(--glass-background)",
                    border: "var(--white) 1px solid",
                    boxShadow: "var(--glass-effect)",
                    "&::placeholder": {
                      color: "red;",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "var(--glass-background)",
                    border: "var(--white) 1px solid",
                    boxShadow: "var(--glass-effect)",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "var(--glass-background)",
                    border: "var(--white) 1px solid",
                    boxShadow: "var(--glass-effect)",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "var(--white)",
                    fontWeight: "bold",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    ":hover": {
                      backgroundColor: "#ff4081",
                      color: "white",
                    },
                  }),
                }}
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
