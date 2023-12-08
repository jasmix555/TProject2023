// presenceUtils.js

import { getAuth } from "firebase/auth";
import {
  ref,
  onDisconnect,
  set,
  get,
  runTransaction,
} from "@firebase/database";
import { getDatabase } from "firebase/database";

export const updatePresence = () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (userId) {
    const presenceRef = ref(getDatabase(), `presence/${userId}`);
    const userRef = ref(getDatabase(), `users/${userId}`);

    // Add user to presence list
    set(presenceRef, true);

    // Remove user from presence list on disconnect
    onDisconnect(presenceRef).remove();

    // Update user count in the database
    runTransaction(userRef, (userData) => {
      if (!userData) {
        return { count: 1 };
      }

      if (userData.count < 5) {
        userData.count += 1;
      }

      return userData;
    });
  }
};
