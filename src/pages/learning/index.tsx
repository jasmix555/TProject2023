import React, { useEffect, useState } from "react";
import style from "@/styles/learning.module.scss";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Layout from "@/component/Layout";
import Header from "@/component/Header";
import { useRouter } from "next/router";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  Firestore,
} from "firebase/firestore/lite";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import Fetch, { FetchProps } from "./component/fetch";
import Fetched from "./component/fetched";
import { WordType } from "@/utils/words";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaBook />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};

export default function Learning() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedWords, setFetchedWords] = useState<WordType[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const db: Firestore = getFirestore();
          const usersCollection = collection(db, "users");
          const userDocRef = doc(usersCollection, user.uid);

          const userData = (await getDoc(userDocRef))?.data();

          if (!userData) {
            // If user data is not found, navigate to the Welcome page
            router.push("/welcome");
          } else {
            // Retrieve fetched words from user data
            const userDictionary = userData.dictionary || [];

            // Check if there are words for today's date
            const todayTimestamp = new Date().setHours(0, 0, 0, 0);
            const wordsForToday = userDictionary.filter(
              (entry: { timestamp: number }) => {
                const entryTimestamp = new Date(entry.timestamp).setHours(
                  0,
                  0,
                  0,
                  0
                );
                return entryTimestamp === todayTimestamp;
              }
            );

            if (wordsForToday.length > 0) {
              // If there are words for today's date, switch to Fetched component
              setFetchedWords(wordsForToday);
            }
          }
        }
      } catch (error) {
        console.error(error);
        // Handle error as needed
      } finally {
        // Introduce a 5-second delay using setTimeout
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      }
    };

    fetchUserData();
  }, [user, router]);

  const fetchProps: FetchProps = {
    onLanguageChange: (language: string) => {},
    onGenreChange: (genre: string) => {},
    onFormSubmit: (words: WordType[]) => {
      setFetchedWords(words);
    },
  };

  return (
    <Layout>
      <Header contents={menus} />
      {fetchedWords.length > 0 ? (
        <Fetched fetchedWords={fetchedWords} />
      ) : (
        <Fetch {...fetchProps} />
      )}
    </Layout>
  );
}
