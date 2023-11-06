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
import Header from "@/component/Header";
import Layout from "@/component/Layout";
import style from "@/styles/settings.module.scss";

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
      <Layout>
        <Header contents={menus} />
        <div className={style.settingsWrap}>
          {user ? (
            <button className={style.signOutBtn} onClick={handleSignOut}>
              サインアウト
            </button>
          ) : (
            "ログアウト中"
          )}
        </div>
      </Layout>
    </>
  );
}
