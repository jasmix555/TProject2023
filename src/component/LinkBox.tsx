import { ReactElement, useState } from "react";
import style from "@/styles/Box.module.scss";
import Link from "next/link";

type Props = {
  icon?: ReactElement;
  link: string;
};

export default function LinkBox({ icon, link }: Props) {
  return (
    <>
      <button className={style.btnWrapper + " " + style.mainBtn}>
        <Link href={link} className={style.icon}>
          {icon}
        </Link>
      </button>
    </>
  );
}
