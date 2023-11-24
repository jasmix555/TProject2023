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
import Header from "@/component/Header";
import Layout from "@/component/Layout";
import Toast, { ToastProps } from "@/component/Toast";
import style from "@/styles/settings.module.scss";

export default function Settings() {
  const { user } = useAuthContext();
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    status: "info",
    onClose: () => {},
  });

  const showToast = (
    message: string,
    status: "success" | "error" | "warning" | "info"
  ) => {
    setToast({
      message,
      status,
      onClose: () =>
        setToast({ message: "", status: "info", onClose: () => {} }),
    });
  };

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default behavior of the button

    // Add a delay of 2 seconds (2000 milliseconds) before signing out
    setTimeout(async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        // Use your custom Toast component for the logout message
        showToast("ログアウトしました。", "success");
      } catch (e) {
        showToast("ログアウト失敗しました。エラーがあります。", "error");
        if (e instanceof FirebaseError) {
          console.log(e);
        }
      } finally {
      }
    }, 2000); // Adjust the delay duration as needed
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
            <button
              className={style.signOutBtn}
              onClick={(e) => handleSignOut(e)}
            >
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
