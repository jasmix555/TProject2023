import { Button, Wrap, useToast } from "@chakra-ui/react";
import { useAuthContext } from "@/feature/provider/AuthProvider";
import { FirebaseError } from "@firebase/util";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/router";
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

  return (
    <>
      <Wrap w={"100%"} position={"relative"} top={40} justifyContent={"center"}>
        {user ? (
          <Button
            colorScheme={"teal"}
            onClick={handleSignOut}
            isLoading={isLoading}
          >
            サインアウト
          </Button>
        ) : (
          "ログアウト中"
        )}
      </Wrap>
    </>
  );
}
