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
import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
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
import { format, differenceInSeconds, addHours } from "date-fns";
import { useRouter } from "next/router";
import style from "@/styles/groupChat.module.scss";
import LayoutPage from "@/component/LayoutPage";
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
  timestamp: number;
  character: number; // Add character field to MessageProps
};

const Message = ({
  message,
  userNickname,
  timestamp,
  character,
}: MessageProps) => {
  const formattedTimestamp = format(new Date(timestamp), "HH:mm");

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
  const { groupId, planet } = router.query; // No need to extract 'title' from the router query
  const [groupInfo, setGroupInfo] = useState({ title: "", expirationTime: "" });

  // Fetch group information
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        console.log("Fetching group information for groupId:", groupId);
        const db = getFirestore();
        const groupDocRef = doc(
          collection(db, "planets", planet as string, "groups"),
          groupId as string
        );
        const groupDocSnapshot = await getDoc(groupDocRef);
        console.log("Group doc snapshot:", groupDocSnapshot);

        if (groupDocSnapshot.exists()) {
          const groupData = groupDocSnapshot.data();
          // console.log("Group data:", groupData);

          // Format the expiration time
          const expirationTime = groupData.expirationTime?.toDate();
          const formattedExpirationTime = expirationTime
            ? format(expirationTime, "yyyy-MM-dd HH:mm:ss")
            : "";

          setGroupInfo({
            title: groupData.title,
            expirationTime: formattedExpirationTime,
          });
        } else {
          console.log("Group not found.");
        }
      } catch (e) {
        console.error("Error fetching group information:", e);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  // Fetch user nickname and character
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDocRef = doc(usersCollection, user?.uid);
        const userData = (await getDoc(userDocRef)).data();

        if (userData) {
          setNickname(userData.nickname);
          setUserCharacter(userData.character);
        }
      } catch (error) {
        console.error(error);
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
        const timestamp = Number(snapshot.val()["timestamp"] ?? 0);
        const character = Number(snapshot.val()["character"] ?? 1);

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

  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const calculateCountdown = () => {
      if (groupInfo.expirationTime) {
        const now = new Date();
        const sixHoursLater = addHours(new Date(groupInfo.expirationTime), 6);

        const secondsRemaining = differenceInSeconds(sixHoursLater, now);

        if (secondsRemaining > 0) {
          setCountdown(secondsRemaining);
        } else {
          // The countdown has reached zero
          setCountdown(null);
        }
      }
    };

    // Calculate initially and then set up interval for continuous updates
    calculateCountdown();

    const intervalId = setInterval(calculateCountdown, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [groupInfo.expirationTime]);

  return (
    <LayoutPage>
      <AuthGuard>
        <div className={style.body}>
          <Header contents={menus} />

          <div className={style.title}>
            <h1>{groupInfo.title || "ロード中..."}</h1>
            {countdown !== null ? (
              <p className={style.number}>
                {format(new Date(countdown * 1000), "hh:mm:ss")}
              </p>
            ) : (
              <p className={style.number}>Time is up!</p>
            )}
          </div>

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
                  <h1>{groupInfo.title || "ロード中..."}</h1>
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
