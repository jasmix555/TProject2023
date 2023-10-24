import { ReactElement, useState } from "react";
import style from "@/styles/OptionBox.module.scss";
import { IconButton } from "@chakra-ui/react";
import { IconType } from "react-icons";
import Link from "next/link";

type Props = {
  icon?: ReactElement;
  link: string;
};

export default function OptionBox({ icon, link }: Props) {
  return (
    <>
      <div className={style.wrapper}>
        <Link href={link} className={style.icon}>
          {icon}
        </Link>
      </div>
    </>
  );
}
