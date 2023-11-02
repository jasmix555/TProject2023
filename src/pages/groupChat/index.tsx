import { FormEvent, useEffect, useRef, useState } from "react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { getAuth, User } from "firebase/auth";
import Header from "@/component/Header";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaXmark,
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
  FaComments,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import style from "@/styles/groupChat.module.scss";

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

type MessageProps = {
  message: string;
  userId: string;
  userNickname: string;
};

const Message = ({ message, userId, userNickname }: MessageProps) => {
  return (
    <div className={style.messageWrap}>
      <div className={style.avatarWrap}>
        <div className={style.avatar}></div>
        <p className={style.username}>{userNickname}</p>
      </div>
      <div className={style.message}>{message}</div>
    </div>
  );
};

export const Page = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const [showGroupChat, setShowGroupChat] = useState(false);

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (user) {
        const db: Firestore = getFirestore();
        const userDocRef = doc(db, "users", user.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            if (userData && userData.nickname) {
              setNickname(userData.nickname);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserNickname();
  }, [user]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const dbRef = ref(db, "chat");
      await push(dbRef, {
        message,
        userId: user ? user.uid : "",
        userNickname: user ? nickname : "",
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  const [chats, setChats] = useState<
    { message: string; userId: string; userNickname: string }[]
  >([]);

  useEffect(() => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, "chat");
      return onChildAdded(dbRef, (snapshot) => {
        const message = String(snapshot.val()["message"] ?? "");
        const userId = String(snapshot.val()["userId"] ?? "");
        const userNickname = String(snapshot.val()["userNickname"] ?? "");
        setChats((prev) => [...prev, { message, userId, userNickname }]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
  }, []);

  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  const toggleGroupChat = () => {
    setShowGroupChat(!showGroupChat);
  };

  return (
    <AuthGuard>
      <div>
        <Header contents={menus} />

        <div>
          <button className={style.groupChatButton} onClick={toggleGroupChat}>
            <FaComments />
          </button>
        </div>

        <div
          className={`${style.groupChatWrap} ${
            showGroupChat ? style.showChat : ""
          }`}
        >
          <div className={style.groupChatContent}>
            <div className={style.header}>
              <div className={style.groupTitle}>
                <button className={style.closeBtn} onClick={toggleGroupChat}>
                  <FaXmark />
                </button>
                <h1>関西人集まれ！</h1>
              </div>
            </div>
            <div className={style.showMessage}>
              {chats.map((chat, index) => (
                <Message
                  message={chat.message}
                  userId={chat.userId}
                  userNickname={chat.userNickname}
                  key={`ChatMessage_${index}`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSendMessage}>
          <div className={style.inputWrap}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={style.input}
              placeholder="入力してください。"
            />
            <button
              type={"submit"}
              disabled={message === ""}
              className={style.sendButton}
            >
              <BsSend />
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
};

export default Page;
