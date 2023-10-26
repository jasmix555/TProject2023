import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import Header from "@/component/Header";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { BsSend } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";

const _message = "確認用メッセージです。";
const _messages = [...Array(10)].map((_, i) => _message.repeat(i + 1));

type MessageProps = {
  message: string;
};

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

const Message = ({ message }: MessageProps) => {
  return (
    <Flex alignItems={"start"} justifyContent={"space-between"}>
      <Avatar size={"lg"} />
      <Box ml={2} w={"80%"}>
        <Text
          bgColor={"gray.200"}
          rounded={"lg"}
          px={2}
          py={1}
          fontSize={"1.6rem"}
        >
          {message}
        </Text>
      </Box>
    </Flex>
  );
};

export const Page = () => {
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const dbRef = ref(db, "chat");
      await push(dbRef, {
        message,
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  const [chats, setChats] = useState<{ message: string }[]>([]);
  useEffect(() => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, "chat");
      return onChildAdded(dbRef, (snapshot) => {
        const message = String(snapshot.val()["message"] ?? "");
        setChats((prev) => [...prev, { message }]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
  }, []);

  return (
    <div>
      <Header contents={menus} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          height: "100%",
          overflowY: "auto",
          marginTop: "10rem",
        }}
      >
        {chats.map((chat, index) => (
          <Message message={chat.message} key={`ChatMessage_${index}`} />
        ))}
      </div>
      <form onSubmit={handleSendMessage} style={{ display: "flex" }}>
        <div
          style={{
            background: "var(--radial-gradient)",
            position: "fixed",
            bottom: 0,
            padding: "0.4rem 2rem 2rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "8rem",
            outline: "none",
            zIndex: 100,
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "85%",
              padding: "0.8rem 1rem",
              color: "#020202",
              fontSize: "1.5rem",
              backgroundColor: "var(--white)",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
              borderRadius: "1rem",
              outline: "none",
            }}
            placeholder="入力してください。"
          />
          <button
            type={"submit"}
            disabled={message === ""}
            style={{
              color: "var(--white)",
              textAlign: "center",
              fontSize: "3rem",
              alignItems: "center",
              padding: "0.8rem 1rem",
            }}
          >
            <BsSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
