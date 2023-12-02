import { useState, useEffect, FormEvent } from "react";
import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/charSelect.module.scss";
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styles from "@/styles/charSelect.module.scss";

// Import Swiper core and required modules
import SwiperCore, { Navigation, Pagination } from "swiper/modules";
import Background from "@/component/Background";

const characters = ["1", "2", "3", "4", "5"];

export default function CharSelect() {
  const [currentChar, setCurrentChar] = useState(0);
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

        // Update the user document in Firestore with the new data
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

  const handleSlideChange = (swiper: any) => {
    // Calculate the new active index within the range of characters
    const newIndex =
      ((swiper.realIndex + characters.length) % characters.length) + 1;
    setCurrentChar(newIndex);
  };

  return (
    <LayoutPage>
      <Background />
      <div className={style.header}>
        <h1>アバター選択</h1>
      </div>
      <div className={style.carouselWrapper}>
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={2}
            centeredSlides
            loop={true}
            pagination={{ clickable: true }}
            navigation
            className={styles.swiper}
            onSlideChange={handleSlideChange}
          >
            {characters.map((character, index) => (
              <SwiperSlide
                key={index}
                className={`${styles.swiperSlide} ${
                  index + 1 === currentChar ? styles.active : ""
                }`}
              >
                <img
                  src={`/characters/${character}.svg`}
                  alt={`Character ${index + 1}`}
                  className={`${styles.swiperImage}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={style.select}
        >
          {isLoading ? "設定中" : "決定！"}
        </button>
      </div>
    </LayoutPage>
  );
}
