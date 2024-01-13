import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  getFirestore,
  Firestore,
} from "firebase/firestore";
import { getAuth, User } from "firebase/auth";
import Header from "@/component/Header";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaBook,
  FaGear,
  FaUsers,
  FaPlus,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import style from "@/styles/createdGroups.module.scss";
import BackBtn from "@/component/BackBtn";
import LayoutPage from "@/component/LayoutPage";
import { motion } from "framer-motion";
import { InView } from "react-intersection-observer";

interface Group {
  id: string;
  title: string;
  description: string;
}

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaBook />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};

const CreatedGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const auth = getAuth();
  const router = useRouter();
  const { planet } = router.query;

  useEffect(() => {
    if (auth.currentUser && planet) {
      const db: Firestore = getFirestore();
      const fetchCreatedGroups = async () => {
        try {
          const groupsCollection = collection(
            db,
            "planets",
            planet as string,
            "groups"
          );
          const user = auth.currentUser as User;
          const q = query(groupsCollection);
          const querySnapshot = await getDocs(q);

          const groupData: {
            id: string;
            title: string;
            createdAt: number;
            description: string;
          }[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            groupData.push({
              id: doc.id,
              title: data.title,
              description: data.description,
              createdAt: data.createdAt,
            });
          });

          const sortedGroups = groupData.sort(
            (a, b) => b.createdAt - a.createdAt
          );

          setGroups(sortedGroups);
        } catch (error) {
          console.error("Error fetching created groups:", error);
        }
      };

      fetchCreatedGroups();
    }
  }, [auth, planet]);

  const variants = {
    hidden: { opacity: 0, y: 100 },
    show: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1 + custom * 0.02,
      },
    }),
  };

  return (
    <LayoutPage>
      <Header contents={menus} />
      <div
        className={style.currentPlanet}
        style={{
          backgroundImage: `url(../planets/${planet}.svg)`,
        }}
      ></div>
      <div className={style.body}>
        <div className={style.content}>
          {groups.length === 0 ? (
            <div className={style.noGroups}>
              <p>No groups found.</p>
            </div>
          ) : (
            <ul>
              {groups.map((group, idx) => {
                return (
                  <InView as="div" triggerOnce key={idx}>
                    {({ ref, inView }) => (
                      <motion.li
                        ref={ref}
                        variants={variants}
                        initial="hidden"
                        animate={inView ? "show" : "hidden"}
                        custom={idx}
                        key={group.id}
                      >
                        <div className={style.contentWrapper}>
                          <Link
                            className={style.contentImg}
                            href={{
                              pathname: `/groupDescription`,
                              query: {
                                groupId: group.id,
                                planet: planet,
                              },
                            }}
                          >
                            <div
                              className={`${style.image} ${
                                style[
                                  `image${Math.floor(Math.random() * 3) + 1}`
                                ]
                              }`}
                              style={{
                                backgroundImage: `url(../planets/${
                                  Math.floor(Math.random() * 6) + 1
                                }.svg)`,
                              }}
                            ></div>
                          </Link>
                          <p className={style.contentTitle}>
                            <span className={style.marqueeOne}>
                              &nbsp;{group.title}
                            </span>
                            <span className={style.marqueeTwo}>
                              &nbsp;{group.title}
                            </span>
                          </p>
                        </div>
                      </motion.li>
                    )}
                  </InView>
                );
              })}
            </ul>
          )}
          <div className={style.createGroup}>
            <Link
              href={{
                pathname: `/createGroup`,
                query: {
                  planet: planet,
                },
              }}
            >
              <button className={style.create}>
                <FaPlus />
              </button>
            </Link>
            <BackBtn link={"/adventure"} />
          </div>
        </div>
      </div>
    </LayoutPage>
  );
};

export default CreatedGroups;
