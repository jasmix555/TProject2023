// firebaseUtils.ts

import {
  ref,
  set,
  onValue,
  getDatabase,
  DatabaseReference,
} from "firebase/database";
import { getAuth, User } from "firebase/auth";

export const increaseUserCount = async (groupId: string, user: User | null) => {
  if (user) {
    try {
      const db = getDatabase();
      const userPresenceRef: DatabaseReference = ref(
        db,
        `groupChatUsers/${groupId}/${user.uid}`
      );

      // Set presence to true for the current user
      await set(userPresenceRef, true);
    } catch (error) {
      console.error("Error increasing user count:", error);
    }
  }
};

export const decreaseUserCount = async (groupId: string, user: User | null) => {
  if (user) {
    try {
      const db = getDatabase();
      const userPresenceRef: DatabaseReference = ref(
        db,
        `groupChatUsers/${groupId}/${user.uid}`
      );

      // Set presence to false for the current user
      await set(userPresenceRef, false);
    } catch (error) {
      console.error("Error decreasing user count:", error);
    }
  }
};

export const listenForUserCount = (
  groupId: string,
  setUserCount: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const db = getDatabase();
    const groupChatUsersRef: DatabaseReference = ref(
      db,
      `groupChatUsers/${groupId}`
    );

    const unsubscribe = onValue(groupChatUsersRef, (snapshot) => {
      const users = snapshot.val();
      const count = users
        ? Object.values(users).filter((value) => value === true).length
        : 0;
      setUserCount(count);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error listening for user count:", error);
  }
};
