import { useState } from "react";
import style from "@/styles/_Box.module.scss";

type MenuBarProps = {
  text?: string;
  contents: {
    icon: any;
    options: {
      icon: any;
      page?: any;
    }[];
  };
};

export default function MenuBar({ text, contents }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Track if the menu is closing

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`${style.menu} ${isMenuOpen ? style.active : ""}`}>
      <button
        className={style.btnWrapper + " " + style.mainBtn}
        onClick={toggleMenu}
      >
        <i className={style.icon}>
          {isMenuOpen ? contents.options[0].icon : contents.icon}
        </i>
      </button>
      <div className={style.btnChildWrap}>
        {isMenuOpen &&
          contents.options.map((icon, idx) =>
            idx !== 0 ? (
              <button
                key={idx}
                className={style.btnWrapper}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <i className={style.icon}>{icon.icon}</i>
              </button>
            ) : null
          )}
      </div>
    </div>
  );
}
