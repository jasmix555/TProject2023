import MenuBar from "@/component/MenuBar";
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
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  TagLeftIcon,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Signup() {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setEmail("");
      setPassword("");
      toast({
        title: "確認メールを送信しました。",
        status: "success",
        position: "top",
      });
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
        <Heading>Sign Up</Heading>
        <chakra.form onSubmit={handleSubmit}>
          <Spacer height={8} aria-hidden />
          <Grid gap={4}>
            <Box display={"contents"}>
              <FormControl>
                <FormLabel>E-Mail</FormLabel>
                <Input
                  type={"email"}
                  name={"email"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    name={"password"}
                    value={password}
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
          <Center flexDir={"column"} gap={3}>
            <Button type={"submit"} isLoading={isLoading}>
              Register
            </Button>
            {/* <Button as={"a"} colorScheme="blue" type="submit">
              Login
            </Button> */}
          </Center>
        </chakra.form>
      </Container>
    </>
  );
}
