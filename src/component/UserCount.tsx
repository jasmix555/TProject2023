import React, { useEffect, useState } from "react";
import { onValue, ref } from "@firebase/database";
import { getDatabase } from "firebase/database";
import { FaUsers } from "react-icons/fa6";
import style from "@/styles/groupChat.module.scss";

const UserCount = ({ groupId }: { groupId: string }) => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Reference to the groupChatUsers node for the specific groupId
    const db = getDatabase();
    const groupChatMessagesRef = ref(db, `groupChatMessages/${groupId}`);

    // Listen for changes in the user count
    const unsubscribe = onValue(groupChatMessagesRef, (snapshot) => {
      const users = snapshot.val();
      const count = users ? Object.keys(users).length : 0;
      setUserCount(count);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [groupId]);

  return (
    <div className={style.capacity}>
      <div className={style.currentUsers}>
        <FaUsers />
        <p>{userCount}/5</p>
      </div>
    </div>
  );
};

export default UserCount;
