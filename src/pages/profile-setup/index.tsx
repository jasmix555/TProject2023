import style from "@/styles/form.module.scss";
import { useState, FormEvent, useEffect } from "react";
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
import Select from "react-select";
import makeAnimated from "react-select/animated";
import LayoutPage from "@/component/LayoutPage";

type OptionType = { value: string; label: string };

export default function ProfileSetup() {
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<OptionType[]>([]);

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
          userId: user.uid,
        };

        await setDoc(userDocRef, userData);

        // User profile data setup successful, redirect to the home page
        router.push("/");
      } else {
        // Handle the case when there's no authenticated user
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user: User | null = auth.currentUser;

        if (user) {
          const db: Firestore = getFirestore();
          const usersCollection = collection(db, "users");
          const userDocRef = doc(usersCollection, user.uid);
          const existingUserData = (await getDoc(userDocRef)).data();

          if (existingUserData) {
            // Populate state with existing user data
            setName(existingUserData.name || "");
            setNickname(existingUserData.nickname || "");
            setLanguages(
              existingUserData.languages
                ? existingUserData.languages.map((code: string) => {
                    // Find the corresponding language object in the options array
                    const language = [
                      { value: "us", label: "英語" },
                      { value: "jp", label: "日本語" },
                      { value: "id", label: "インドネシア語" },
                      { value: "cn", label: "中国語" },
                      { value: "fr", label: "フランス語" },
                      { value: "kr", label: "韓国語" },
                      { value: "es", label: "スペイン語" },
                    ].find((option) => option.value === code);

                    // If a match is found, return the language object
                    // If a match is not found, return an object with the value property and a placeholder label
                    return language
                      ? language
                      : { value: code, label: "Unknown language" };
                  })
                : []
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const animatedComponents = makeAnimated();

  return (
    <LayoutPage>
      <div className={style.bodyWrap}>
        <form onSubmit={handleSubmit}>
          <div className={style.contentWrap}>
            <div className={style.logo}></div>
            <div className={style.inputWrap}>
              <div className={style.frame}></div>
              <div className={style.title}>
                {getAuth().currentUser ? "Edit Profile" : "Create Profile"}
              </div>
              <div className={style.content}>
                <label htmlFor="name">Username</label>
                <input
                  autoComplete="off"
                  className={style.input}
                  type="text"
                  name="name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </div>
              <div className={style.content}>
                <p>Languages learnt</p>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
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
                      backgroundColor: "var(--input-bg)",
                      border: "var(--border-stroke)",
                      boxShadow: "var(--border-shadow)",
                      width: "30rem",
                      Height: "5rem",
                      fontWeight: "600",
                      borderRadius: "10px",
                      padding: "1rem 0.4rem",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "var(--white)",
                      boxShadow: "none !important",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "var(--input-bg)",
                      border: "var(--border-stroke)",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "var(--white)",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "var(--input-bg)",
                      border: "var(--border-stroke)",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "var(--input-clr)",
                      fontWeight: "600",
                    }),
                    option: (styles, { isFocused, isSelected }) => {
                      if (isSelected) {
                        return {
                          ...styles,
                          backgroundColor: "grey",
                        };
                      } else if (isFocused) {
                        return {
                          ...styles,
                          color: "black",
                          backgroundColor: "var(--white)",
                        };
                      } else {
                        return styles;
                      }
                    },
                  }}
                />
              </div>
            </div>
            <div className={style.submitWrap}>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save User Info"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </LayoutPage>
  );
}
