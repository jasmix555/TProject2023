import { Flex, Wrap } from "@chakra-ui/react";
import { RiMenu3Line } from "react-icons/ri";
import OptionBox from "@/component/OptionBox";

type insert = {
  text?: string;
};

export default function MenuBar({ text }: insert) {
  return (
    <>
      <Wrap>
        <OptionBox icon={<RiMenu3Line />} />
      </Wrap>
    </>
  );
}
