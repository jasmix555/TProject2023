import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getDatabase,
  onChildAdded,
  push,
  ref,
  serverTimestamp,
} from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { AuthGuard } from "@/feature/auth/component/AuthGuard/AuthGuard";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore";
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
import { format } from "date-fns"; // Import format function
import { useRouter } from "next/router";
import style from "@/styles/groupChat.module.scss";
import LayoutPage from "@/component/LayoutPage";

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
  timestamp: string;
};

const Message = ({
  message,
  userId,
  userNickname,
  timestamp,
}: MessageProps) => {
  const formattedTimestamp = format(new Date(parseInt(timestamp)), "HH:mm"); // Format the timestamp

  return (
    <div className={style.messageWrap}>
      <div className={style.avatarWrap}>
        <div className={style.avatar}></div>
      </div>
      <div className={style.messageWrap}>
        <div className={style.messageHeader}>
          <p>{userNickname}</p>
          <p>{formattedTimestamp} </p>
        </div>
        <div className={style.message}>{message}</div>
      </div>
    </div>
  );
};
// Your existing imports...

export const Page = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const [showGroupChat, setShowGroupChat] = useState(false);
  const router = useRouter();
  const { groupId, title } = router.query;

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
      const dbRef = ref(db, `groupChatMessages/${groupId}`); // Reference the specific group's chat messages
      await push(dbRef, {
        message,
        userId: user ? user.uid : "",
        userNickname: user ? nickname : "",
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  const [chats, setChats] = useState<MessageProps[]>([]);

  useEffect(() => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, `groupChatMessages/${groupId}`); // Reference the specific group's chat messages
      return onChildAdded(dbRef, (snapshot) => {
        const message = String(snapshot.val()["message"] ?? "");
        const userId = String(snapshot.val()["userId"] ?? "");
        const userNickname = String(snapshot.val()["userNickname"] ?? "");
        const timestamp = String(snapshot.val()["timestamp"] ?? "");
        setChats((prev) => [
          ...prev,
          { message, userId, userNickname, timestamp },
        ]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
  }, [groupId]); // Trigger a new query when the groupId changes

  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  const toggleGroupChat = () => {
    setShowGroupChat(!showGroupChat);
  };

  const expirationTime = "2023-11-08T12:00:00"; // Replace with the actual expiration timestamp
  // Calculate the remaining time in hours
  const calculateRemainingTime = (expirationTimestamp: string) => {
    const currentTime = new Date().getTime();
    const expirationTime = new Date(expirationTimestamp).getTime();
    const remainingMilliseconds = expirationTime - currentTime;
    if (remainingMilliseconds <= 0) {
      return { hours: 0, minutes: 0 };
    }
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    return { hours: remainingHours, minutes: remainingMinutes };
  };
  const remainingTime = expirationTime
    ? calculateRemainingTime(expirationTime)
    : { hours: 0, minutes: 0 };

  return (
    <LayoutPage>
      <AuthGuard>
        <div className={style.body}>
          <Header contents={menus} />

          <div className={style.title}>
            <h1>{title}</h1>
            {
              <div className={style.remainingTime}>
                <span>{remainingTime.hours}</span>
                <span>時間</span>
                <span>{remainingTime.minutes}</span>
                <span>分</span>
              </div>
            }
          </div>

          <div className={style.remainingTime}></div>

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
                  <h1>{title}</h1>
                </div>
              </div>
              <div className={style.showMessage} ref={messagesElementRef}>
                {chats.map((chat, index) => (
                  <Message
                    message={chat.message}
                    userId={chat.userId}
                    userNickname={chat.userNickname}
                    timestamp={chat.timestamp}
                    key={`ChatMessage_${index}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSendMessage}>
            <div className={style.inputWrap}>
              <textarea
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
    </LayoutPage>
  );
};

export default Page;
