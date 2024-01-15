import { getFirestore, collection, doc, getDoc } from "firebase/firestore/lite";
import style from "@/styles/groupDesc.module.scss";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import BackBtn from "@/component/BackBtn";
import {
  ref,
  set,
  getDatabase,
  DatabaseReference,
  get,
} from "firebase/database";
import { listenForUserCount } from "@/lib/firebase/firebaseUtils";
import { RiMenu3Line } from "react-icons/ri";
import {
  FaRegCircleXmark,
  FaBell,
  FaUserAstronaut,
  FaGear,
  FaUsers,
} from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Layout from "@/component/Layout";
import LayoutPage from "@/component/LayoutPage";
import Header from "@/component/Header";

const menus = {
  icon: <RiMenu3Line />,
  options: [
    { icon: <FaRegCircleXmark />, link: "/#" },
    { icon: <FaBell />, link: "/#" },
    { icon: <FaUserAstronaut />, link: "/#" },
    { icon: <FaUsers />, link: "/#" },
    { icon: <FaEdit />, link: "/#" },
    { icon: <FaGear />, link: "/../settings" },
  ],
};
interface Group {
  id: string;
  title: string;
  description: string;
}

export default function GroupDescription() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const { groupId, planet } = router.query;

  const [group, setGroup] = useState<Group>({
    id: "",
    title: "",
    description: "",
  });

  const [descriptionValue, setDescriptionValue] = useState(
    group.description || ""
  );

  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (user && groupId) {
        try {
          const db = getFirestore();
          const groupDocRef = doc(
            collection(db, "planets", planet as string, "groups"),
            groupId as string
          );

          const groupDoc = await getDoc(groupDocRef);

          if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            setGroup({
              id: groupDoc.id,
              title: groupData.title,
              description: groupData.description,
            });

            setDescriptionValue(groupData.description);
          } else {
            console.log("Group not found.");
          }
        } catch (error) {
          console.error("Error fetching group information:", error);
        }
      }
    };

    const fetchUserCount = () => {
      if (groupId) {
        try {
          const unsubscribe = listenForUserCount(
            groupId as string,
            setUserCount
          );

          return () => {
            if (unsubscribe) unsubscribe();
          };
        } catch (error) {
          console.error("Error fetching user count:", error);
        }
      }
    };

    fetchGroupInfo();
    const unsubscribeUserCount = fetchUserCount();

    return () => {
      if (unsubscribeUserCount) {
        unsubscribeUserCount();

        // Decrement user count and set presence to false when leaving the page
        if (groupId && user) {
          const db = getDatabase();
          const userPresenceRef = ref(
            db,
            `groupChatUsers/${groupId}/${user.uid}`
          );

          // Set presence to false for the current user when leaving the page
          set(userPresenceRef, false)
            .then(() => {
              console.log("Presence set to false successfully.");
            })
            .catch((error) => {
              console.error("Error setting presence to false:", error);
            });
        }
      }
    };
  }, [user, groupId, planet]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user && groupId && group) {
      try {
        const db = getDatabase();
        const groupChatUsersRef: DatabaseReference = ref(
          db,
          `groupChatUsers/${groupId}`
        );

        // Fetch the existing users
        const existingUsersSnapshot = await get(groupChatUsersRef);
        const existingUsers = existingUsersSnapshot.val() || {};

        // Add the current user with presence set to true
        existingUsers[user.uid] = true;

        // Set the updated users list
        await set(groupChatUsersRef, existingUsers);

        router.push({
          pathname: `/groupChat`,
          query: {
            planet,
            groupId,
          },
        });
      } catch (error) {
        console.error("Error entering group chat:", error);
      }
    }
  };

  return (
    <LayoutPage>
      <Header contents={menus} />
      <form onSubmit={handleSubmit} className={style.form}>
        <div className={style.contentWrap}>
          <input
            disabled
            className={style.title}
            type="text"
            defaultValue={group.title}
          />
          <textarea
            className={style.description}
            value={descriptionValue}
            disabled
            onChange={(e) => setDescriptionValue(e.target.value)}
          />
          <div className={style.capacity}>
            <div className={style.currentUsers}>
              <FaUsers />
              <p>{userCount}/5</p>
            </div>
          </div>
        </div>

        <div className={style.buttons}>
          <div className={style.expirationTag}>
            <p>※惑星は6時間経つと消滅してしまうよ!</p>
          </div>
          <button type="submit" className={style.create}>
            着陸する！
          </button>
          <BackBtn link={`/createdGroups?planet=${planet}`} />
        </div>
      </form>
    </LayoutPage>
  );
}
