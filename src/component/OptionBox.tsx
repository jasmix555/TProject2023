import { ReactElement, useState } from "react";
import style from "@/styles/Box.module.scss";

type Props = {
  icon?: ReactElement;
};

export default function OptionBox({ icon }: Props) {
  return (
    <>
      <div className={style.wrapper}>
        <button className={style.icon}>{icon}</button>
      </div>
    </>
  );
}
