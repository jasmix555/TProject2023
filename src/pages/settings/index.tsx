import { Button, Wrap, useToast } from "@chakra-ui/react";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { FirebaseError } from "@firebase/util";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import Footer from "@/component/Footer";
import Header from "@/component/Header";

export default function Settings() {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { push } = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      await signOut(auth);
      toast({
        title: "ログアウトしました。",
        status: "success",
        position: "top",
      });
      push("/welcome");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
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
    ],
  };

  return (
    <>
      <Header contents={menus} />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "80%",
          height: "100vh",
        }}
      >
        {user ? (
          <Button
            colorScheme={"red"}
            fontSize={"x-large"}
            p={9}
            onClick={handleSignOut}
            isLoading={isLoading}
          >
            サインアウト
          </Button>
        ) : (
          "ログアウト中"
        )}
      </div>
      <Footer />
    </>
  );
}
