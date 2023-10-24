import {
  Button,
  chakra,
  Container,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useToast,
  Wrap,
} from "@chakra-ui/react";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { FirebaseError } from "@firebase/util";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { RiMenu3Line } from "react-icons/ri";
import style from "@/styles/OptionBox.module.scss";
import OptionBox from "./OptionBox";

type insert = {
  text?: string;
};

export default function MenuBar({ text }: insert) {
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
      push("/signin");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Wrap position={"absolute"} top={5} right={5} zIndex={9999}>
        {user ? (
          <OptionBox icon={<RiMenu3Line />} link={"#"} />
        ) : (
          <Link href={"/signin"} passHref>
            <Button>Sign In</Button>
          </Link>
        )}
      </Wrap>
    </>
  );
}
