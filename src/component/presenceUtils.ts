import { useEffect } from "react";
import { getDatabase, ref, onDisconnect, set } from "firebase/database";
import { getAuth } from "firebase/auth";

export const usePresence = (groupId: string) => {
  useEffect(() => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const presenceRef = ref(db, `groupChatUsers/${groupId}/${user.uid}`);

      // Set presence to true
      set(presenceRef, true);

      // Remove presence on disconnect
      onDisconnect(presenceRef).remove();
    }
  }, [groupId]);
};
