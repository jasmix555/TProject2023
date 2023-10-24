import {
  Box,
  Button,
  Center,
  chakra,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  InputGroup,
  Icon,
  Spacer,
  useToast,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import MenuBar from "@/component/MenuBar";
import { push } from "firebase/database";

export default function Signin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      toast({
        title: "ログインしました。",
        status: "success",
        position: "top",
      });
      //TODO: ログイン後のページに遷移の処理を書く
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
    <>
      <MenuBar />
      <Container py={4}>
        <Heading>Sign In</Heading>
        <chakra.form onSubmit={handleSubmit}>
          <Spacer height={8} aria-hidden />
          <Grid gap={4}>
            <Box display={"contents"}>
              <FormControl>
                <FormLabel color={"white"}>E-Mail</FormLabel>
                <Input
                  type={"email"}
                  name={"email"}
                  value={email}
                  color={"white"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={"white"}>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    name={"password"}
                    value={password}
                    color={"white"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <InputRightElement width="4rem">
                    <Icon
                      cursor={"pointer"}
                      onClick={handleClick}
                      fontSize={"1.6rem"}
                    >
                      {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </Icon>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
          </Grid>
          <Spacer height={4} aria-hidden />
          <Center>
            <Button isLoading={isLoading} colorScheme="blue" type="submit">
              Login
            </Button>
          </Center>
        </chakra.form>
      </Container>
    </>
  );
}
