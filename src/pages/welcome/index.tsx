import style from "@/styles/Welcome.module.scss";
import Link from "next/link";
import { useState } from "react";

export default function Welcome() {
  return (
    <>
      <div className={style.wrapper}>
        <div className={style.logo}></div>
        <button>Start</button>
      </div>
    </>
  );
}
