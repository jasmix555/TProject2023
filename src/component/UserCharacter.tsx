import Image from "next/image";
import style from "@/styles/index.module.scss";

export default function UserCharacter() {
  return (
    <>
      <div className={style.characterWrap}>
        <div className={style.character}>
          <Image
            src={"/characters/Char1L.svg"}
            alt="UserCharacter"
            width={200}
            height={200}
          />
        </div>
      </div>
    </>
  );
}
