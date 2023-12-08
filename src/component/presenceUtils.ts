import {
  runTransaction,
  getDatabase,
  onDisconnect,
  ref,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";

export const usePresence = (groupId: string) => {
  useEffect(() => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const presenceRef = ref(db, `groupChatUsers/${groupId}/${user.uid}`);

      runTransaction(presenceRef, (currentData) => {
        // Ensure that the currentData is not overwritten by another transaction
        if (!currentData) {
          // Set presence to true if it doesn't exist
          return true;
        } else {
          // Do not modify existing data
          return;
        }
      }).then(() => {
        // Remove presence on disconnect
        onDisconnect(presenceRef).remove();
      });
    }
  }, [groupId]);
};
