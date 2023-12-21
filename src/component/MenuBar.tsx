import { useState } from "react";
import style from "@/styles/_Box.module.scss";
import Link from "next/link";

type MenuBarProps = {
  contents: {
    icon: any;
    options: {
      icon: any;
      page?: any;
      link?: any;
    }[];
  };
};

export default function MenuBar({ contents }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Link href={icon.link}>
                  <i className={style.icon}>{icon.icon}</i>
                </Link>
              </button>
            ) : null
          )}
      </div>
    </div>
  );
}
