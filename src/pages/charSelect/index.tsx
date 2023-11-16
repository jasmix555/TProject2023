import { useState } from "react";
import LayoutPage from "@/component/LayoutPage";
import style from "@/styles/charSelect.module.scss";
import Image from "next/image";

export default function CharSelect() {
  const [currentChar, setCurrentChar] = useState(1);
  const totalChars = 5;

  const goLeft = () => {
    setCurrentChar(currentChar === 1 ? totalChars : currentChar - 1);
  };

  const goRight = () => {
    setCurrentChar(currentChar === totalChars ? 1 : currentChar + 1);
  };

  return (
    <LayoutPage>
      <div className={style.header}>
        <h1>アバター選択</h1>
      </div>
      <div className={style.carouselWrapper}>
        <div className={style.characterWrap}>
          <div className={style.previous}>
            <Image
              src={`/characters/Char${
                currentChar === 1 ? totalChars : currentChar - 1
              }M.svg`}
              alt="previous character"
              width={141}
              height={200}
              className={style.dimmed}
            />
          </div>
          <div className={style.current}>
            <Image
              src={`/characters/Char${currentChar}L.svg`}
              alt="current character"
              width={283}
              height={400}
            />
          </div>
          <div className={style.next}>
            <Image
              src={`/characters/Char${
                currentChar === totalChars ? 1 : currentChar + 1
              }M.svg`}
              alt="next character"
              width={141}
              height={200}
              className={style.dimmed}
            />
          </div>
        </div>

        <div className={style.carouselBtnWrapper}>
          <div className={style.left}>
            <button onClick={goLeft}>Left</button>
          </div>
          <div className={style.right}>
            <button onClick={goRight}>Right</button>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
