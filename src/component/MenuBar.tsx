import { Flex, Wrap } from "@chakra-ui/react";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import OptionBox from "@/component/OptionBox";
import { useState } from "react";
import style from "@/styles/Box.module.scss";
import { log } from "console";

type MenuBarProps = {
  text?: string;
};

export default function MenuBar({ text }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menus = {
    icon: <RiMenu3Line />,
    options: [
      {
        icon: <FaRegCircleXmark />,
      },
      {
        icon: <FaBell />,
      },
      {
        icon: <FaUserAstronaut />,
      },
      {
        icon: <FaUsers />,
      },
      {
        icon: <FaBook />,
      },
      {
        icon: <FaEdit />,
      },
      {
        icon: <FaGear />,
      },
    ],
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={isMenuOpen ? style.flex + " " + style.active : style.flex}
      >
        <button
          className={style.btnWrapper}
          onClick={() => {
            toggleMenu();
            console.log(isMenuOpen);
          }}
        >
          <i className={style.icon}>
            {isMenuOpen ? menus.options[0].icon : menus.icon}
          </i>
        </button>
        {isMenuOpen &&
          menus.options.map((icon, idx) =>
            idx !== 0 ? (
              <button key={idx} className={style.btnWrapper}>
                <i className={style.icon}>{icon.icon}</i>
              </button>
            ) : null
          )}
      </div>
    </>
  );
}
