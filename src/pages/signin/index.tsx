import { useToast } from "@chakra-ui/react";
import { FormEvent, useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";
import style from "@/styles/form.module.scss";
import { getDoc, doc, getFirestore } from "firebase/firestore/lite";
import LayoutPage from "@/component/LayoutPage";

export default function Signin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { push } = useRouter();
  const auth = getAuth();

  // Check if the user's profile setup is complete
  const checkProfileSetup = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();

      // Replace 'users' with the actual collection name where user data is stored
      const userDocRef = doc(db, "users", user.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          // Profile setup is complete, redirect to the index page
          push("/");
        } else {
          // Profile setup is not complete, send them to the profile setup page
          push("/profile-setup");
        }
      } catch (error) {
        console.error("Error checking profile setup:", error);
      }
    }
  };

  useEffect(() => {
    // Check the profile setup when the component loads
    checkProfileSetup();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      toast({
        title: "ログインしました。",
        status: "success",
        position: "top",
      });
      checkProfileSetup(); // Check the profile setup after a successful login
    } catch (e) {
      toast({
        title: "エラーが発生しました。",
        status: "error",
        position: "top",
      });
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutPage>
      <div className={style.bodyWrap}>
        <form onSubmit={handleSubmit}>
          <div className={style.contentWrap}>
            <div className={style.inputWrap}>
              <p>E-Mail</p>
              <input
                className={style.input}
                type={"email"}
                name={"email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className={style.inputWrap}>
              <p>Password</p>
              <div className={style.iconVis}>
                <input
                  className={style.input}
                  type={show ? "text" : "password"}
                  name={"password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <i onClick={handleClick}>
                  {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                </i>
              </div>
            </div>
          </div>
          <div className={style.submitWrap}>
            <button type="submit">
              {isLoading ? "ログイン中" : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </LayoutPage>
  );
}
