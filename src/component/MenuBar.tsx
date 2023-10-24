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
import { useState } from "react";
import style from "@/styles/Box.module.scss";

type MenuBarProps = {
  text?: string;
};

// export default function MenuBar({ text }: MenuBarProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const menus = {
//     icon: <RiMenu3Line />,
//     options: [
//       {
//         icon: <FaRegCircleXmark />,
//       },
//       {
//         icon: <FaBell />,
//       },
//       {
//         icon: <FaUserAstronaut />,
//       },
//       {
//         icon: <FaUsers />,
//       },
//       {
//         icon: <FaBook />,
//       },
//       {
//         icon: <FaEdit />,
//       },
//       {
//         icon: <FaGear />,
//       },
//     ],
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       <div
//         className={isMenuOpen ? style.flex + " " + style.active : style.flex}
//       >
//         <button
//           className={style.btnWrapper}
//           onClick={() => {
//             toggleMenu();
//             console.log(isMenuOpen);
//           }}
//         >
//           <i className={style.icon}>
//             {isMenuOpen ? menus.options[0].icon : menus.icon}
//           </i>
//         </button>
//         <div className={style.btnChildWrap}>
//           {isMenuOpen &&
//             menus.options.map((icon, idx) =>
//               idx !== 0 ? (
//                 <button key={idx} className={style.btnWrapper}>
//                   <i className={style.icon}>{icon.icon}</i>
//                 </button>
//               ) : null
//             )}
//         </div>
//       </div>
//     </>
//   );
// }

export default function MenuBar({ text }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menus = {
    icon: <RiMenu3Line />,
    options: [
      <FaRegCircleXmark />,
      <FaBell />,
      <FaUserAstronaut />,
      <FaUsers />,
      <FaBook />,
      <FaEdit />,
      <FaGear />,
    ],
  };

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
          {isMenuOpen ? menus.options[0] : menus.icon}
        </i>
      </button>
      <div className={style.btnChildWrap}>
        {isMenuOpen &&
          menus.options.map((icon, idx) =>
            idx !== 0 ? (
              <button
                key={idx}
                className={style.btnWrapper}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <i className={style.icon}>{icon}</i>
              </button>
            ) : null
          )}
      </div>
    </div>
  );
}
