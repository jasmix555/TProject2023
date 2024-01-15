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
import { useEffect, useState } from "react";
import Fetch, { FetchProps } from "./component/fetch";
import Fetched from "./component/fetched"; // Import the Fetched component
import { WordType } from "@/lib/words/words";

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
  const [isFetching, setIsFetching] = useState(true);
  const [fetchedWords, setFetchedWords] = useState<WordType[]>([]); // Track fetched words

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
            // User data found, set isFetching to false
            setIsFetching(false);
            // Retrieve fetched words from user data
            setFetchedWords(userData.dictionary || []);
          }
        }
      } catch (error) {
        console.error(error);
        // Handle error as needed
      }
    };

    fetchUserData();
  }, [user, router]);

  const fetchProps: FetchProps = {
    onLanguageChange: (language: string) => {},
    onGenreChange: (genre: string) => {},
    onFormSubmit: (words: WordType[]) => {
      console.log("Fetched Words:", words);
      setFetchedWords(words);
    },
  };

  return (
    <Layout>
      <Header contents={menus} />
      {isFetching ? (
        <Fetch {...fetchProps} />
      ) : (
        <Fetched fetchedWords={fetchedWords} /> // Pass fetchedWords to the Fetched component
      )}
    </Layout>
  );
}
