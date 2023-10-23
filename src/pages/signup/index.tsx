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
  Spacer,
  TagLeftIcon,
} from "@chakra-ui/react";
import { AiOutlineMail } from "react-icons/ai";

export default function Signup() {
  return (
    <>
      <Container py={14}>
        <Heading>Signup</Heading>
        <chakra.form>
          <Spacer height={8} aria-hidden />
          <Grid gap={4}>
            <Box display={"contents"}>
              <FormControl>
                <FormLabel>E-Mail</FormLabel>
                <Input type={"email"} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type={"password"} />
              </FormControl>
            </Box>
          </Grid>
          <Spacer height={4} aria-hidden />
          <Center>
            <Button type={"submit"}>Register</Button>
          </Center>
        </chakra.form>
      </Container>
    </>
  );
}
