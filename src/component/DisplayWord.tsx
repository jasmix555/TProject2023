import style from "@/styles/displayWord.module.scss";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface WordData {
  genre: string;
  language: string;
  meaning: string;
  messageKey: string;
  pronunciation: string;
  timestamp: number;
  word: string;
}

export default function DisplayWord() {
  const { user } = useAuthContext();
  const [learnedWords, setLearnedWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const db: Firestore = getFirestore();
          const usersCollection = collection(db, "users");
          const userDocRef = doc(usersCollection, user.uid);

          const userData = (await getDoc(userDocRef))?.data();
          const dictionary = userData?.dictionary || [];

          setLearnedWords(dictionary);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <>
      <div className={style.planet}></div>
      <div className={style.wrapper}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Carousel
            swipeable={true}
            infiniteLoop={true}
            emulateTouch={true}
            stopOnHover={true}
            showStatus={false}
            showThumbs={false}
            autoPlay={true}
            showIndicators={false}
            showArrows={false}
            interval={6000}
          >
            {learnedWords.map((wordData, index) => (
              <div key={index} className={style.wordWrap}>
                <div className={style.number}>
                  <h1>{(index + 1).toString().padStart(2, "0")}</h1>
                </div>
                <div className={style.word}>
                  <h1>{wordData.word}</h1>
                </div>
                <div className={style.meaning}>
                  <p>{wordData.meaning || "-------"}</p>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </>
  );
}
