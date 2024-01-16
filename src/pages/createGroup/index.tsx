import { useState } from "react";
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import style from "@/styles/createGroup.module.scss";
import LayoutPage from "@/component/LayoutPage";
import BackBtn from "@/component/BackBtn";
import Header from "@/component/Header";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Motion from "@/component/Motion";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/profile-setup" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaGear />, link: "/settings" },
  ],
};

export default function CreateGroup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationTime, setExpirationTime] = useState("2");
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const { planet } = router.query;

  const isSubmitDisabled = !title || title.length < 5 || !description;

  const calculateExpirationTimestamp = () => {
    return Timestamp.fromMillis(Date.now() + 6 * 60 * 60 * 1000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const db = getFirestore();
      const planetGroupsRef = collection(
        db,
        "planets",
        planet as string,
        "groups"
      );

      try {
        const newGroupRef = await addDoc(planetGroupsRef, {
          creatorId: user.uid,
          title,
          description,
          expirationTime: calculateExpirationTimestamp(),
          createdAt: Timestamp.now(),
        });

        const groupId = newGroupRef.id;

        // Navigate to the group description page using the generated groupId
        router.push({
          pathname: `/groupDescription`,
          query: {
            groupId,
            planet,
          },
        });
      } catch (error) {
        console.error("Error creating group:", error);
        // Add logic to handle errors (e.g., display an error message to the user)
      }
    }
  };

  return (
    <LayoutPage>
      <Header contents={menus} />
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.contentWrap}>
          <Motion classname={style.content} delay={0.1}>
            <p>タイトル</p>
            <input
              className={style.input + " " + style.title}
              type="text"
              placeholder="タイトルを入力してください..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Motion>
          <Motion classname={style.content} delay={0.2}>
            <p>詳細</p>
            <textarea
              className={style.input + " " + style.textarea}
              placeholder="詳細を入力してください..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Motion>
        </div>
        <div className={style.buttons}>
          <div className={style.expirationTag}>
            <p>※惑星は6時間経つと消滅してしまうよ!</p>
          </div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={style.create}
          >
            ここに展開する！
          </button>
          <BackBtn link={`/createdGroups?planet=${planet}`} />
        </div>
      </form>
    </LayoutPage>
  );
}
