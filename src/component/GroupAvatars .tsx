import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "@firebase/database";
import { FaUserAstronaut } from "react-icons/fa6";
import { getFirestore, doc, getDoc } from "firebase/firestore";

type UserAvatarsProps = {
  groupId: string;
};

const UserAvatars = ({ groupId }: UserAvatarsProps) => {
  const [userAvatars, setUserAvatars] = useState([]);

  useEffect(() => {
    const fetchUserAvatars = async () => {
      if (groupId) {
        try {
          const db = getDatabase();
          const groupChatUsersRef = ref(db, `groupChatUsers/${groupId}`);

          // Use onValue to listen for changes in the user avatars
          return onValue(groupChatUsersRef, async (snapshot) => {
            const users = snapshot.val();
            if (users) {
              const userPromises = Object.values(users).map(async (user) => {
                const userDocRef = doc(getFirestore(), "users", user.userId);
                const userDocSnapshot = await getDoc(userDocRef);
                const userData = userDocSnapshot.data();

                return (
                  <div key={user.userId}>
                    <img
                      src={`/characters/${userData.character}.svg`}
                      alt={`UserCharacter ${userData.character}`}
                      width={30}
                      height={30}
                    />
                    <span>{userData.nickname}</span>
                  </div>
                );
              });

              const avatars = await Promise.all(userPromises);
              setUserAvatars(avatars);
            }
          });
        } catch (error) {
          console.error("Error fetching user avatars:", error);
        }
      }
    };

    const unsubscribeUserAvatars = fetchUserAvatars();

    return () => {
      if (unsubscribeUserAvatars) {
        unsubscribeUserAvatars();
      }
    };
  }, [groupId]);

  return (
    <div>
      {userAvatars.length > 0 ? (
        userAvatars
      ) : (
        <FaUserAstronaut size={30} color="#888" />
      )}
    </div>
  );
};

export default UserAvatars;
