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
import { group } from "console";
import Image from "next/image";

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
  character: number; // Add character field to MessageProps
};

const Message = ({
  message,
  userNickname,
  timestamp,
  character,
}: MessageProps) => {
  const formattedTimestamp = format(new Date(parseInt(timestamp)), "HH:mm"); // Format the timestamp

  return (
    <div className={style.messageWrap}>
      <div className={style.avatarWrap}>
        <div className={style.avatar}>
          <Image
            src={`/characters/Char${character}L.svg`}
            alt={`UserCharacter ${character}`}
            width={50}
            height={50}
          />
        </div>
      </div>
      <div className={style.messageContentWrap}>
        <div className={style.messageHeader}>
          <p>{userNickname}</p>
          <p>{formattedTimestamp} </p>
        </div>
        <div className={style.message}>{message}</div>
      </div>
    </div>
  );
};

export const Page = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [userCharacter, setUserCharacter] = useState<number>(1); // Initialize with a default value
  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const [showGroupChat, setShowGroupChat] = useState(false);
  const router = useRouter();
  const { groupId, title } = router.query;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const db: Firestore = getFirestore();
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();

            if (userData && userData.nickname) {
              setNickname(userData.nickname);
            }

            if (userData && userData.character) {
              setUserCharacter(userData.character);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Send message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const dbRef = ref(db, `groupChatMessages/${groupId}`);
      await push(dbRef, {
        message,
        title,
        userId: user ? user.uid : "",
        userNickname: user ? nickname : "",
        timestamp: serverTimestamp(),
        character: userCharacter, // Pass user's character number to the message
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  // Listen for new messages
  const [chats, setChats] = useState<MessageProps[]>([]);

  // Listen for new messages
  useEffect(() => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, `groupChatMessages/${groupId}`);
      return onChildAdded(dbRef, (snapshot) => {
        const message = String(snapshot.val()["message"] ?? "");
        const userId = String(snapshot.val()["userId"] ?? "");
        const userNickname = String(snapshot.val()["userNickname"] ?? "");
        const timestamp = String(snapshot.val()["timestamp"] ?? "");
        const character = Number(snapshot.val()["character"] ?? 1); // Default to 1 if character is not present
        setChats((prev) => [
          ...prev,
          { message, userId, userNickname, timestamp, character },
        ]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
  }, [groupId]);

  // Scroll to the bottom of the messages when a new message is added
  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  // Toggle group chat
  const toggleGroupChat = () => {
    setShowGroupChat(!showGroupChat);
  };

  // Calculate remaining time
  const expirationTime = "2023-11-08T12:00:00";
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
            <h1>{title || "ロード中..."}</h1>
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
                  <h1>{title || "ロード中..."}</h1>
                </div>
              </div>
              <div className={style.showMessage} ref={messagesElementRef}>
                {chats.map((chat, index) => (
                  <Message
                    message={chat.message}
                    userId={chat.userId}
                    userNickname={chat.userNickname}
                    timestamp={chat.timestamp}
                    character={chat.character}
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
