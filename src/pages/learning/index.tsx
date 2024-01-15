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
import { WordType } from "@/lib/words/words";
import Fetching from "./component/fetching";

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
    },
  };

  return (
    <Layout>
      <Header contents={menus} />
      <Fetch {...fetchProps} />
    </Layout>
  );
}
