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

type MenuBarProps = {
  text?: string;
};

export default function MenuBar({ text }: MenuBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menus = [
    {
      icon: <RiMenu3Line />,
      options: [
        {
          icon: <OptionBox icon={<FaRegCircleXmark />} />,
          label: "Option 1",
        },
        {
          icon: <OptionBox icon={<FaBell />} />,
          label: "Option 2",
        },
        {
          icon: <OptionBox icon={<FaUserAstronaut />} />,
          label: "Option 3",
        },
        {
          icon: <OptionBox icon={<FaUsers />} />,
          label: "Option 4",
        },
        {
          icon: <OptionBox icon={<FaBook />} />,
          label: "Option 5",
        },
        {
          icon: <OptionBox icon={<FaEdit />} />,
          label: "Option 6",
        },
        {
          icon: <OptionBox icon={<FaGear />} />,
          label: "Option 7",
        },
      ],
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Wrap>
        {menus.map((menu) => (
          <div key={menu.icon.props.children}>
            <OptionBox icon={menu.icon} onClick={toggleMenu} />
            {isMenuOpen && (
              <Wrap
                bg="white"
                boxShadow="md"
                p={2}
                position="absolute"
                zIndex={1}
              >
                {menu.options.map((option) => (
                  <OptionBox key={option.label} icon={option.icon} />
                ))}
              </Wrap>
            )}
          </div>
        ))}
      </Wrap>
    </>
  );
}
