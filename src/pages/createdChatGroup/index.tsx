import { useState, useEffect } from "react";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function CreatedChatGroup() {
  const router = useRouter();
  const { groupId } = router.query; // Get the groupId from the router query parameters
  const [groupInfo, setGroupInfo] = useState(null); // State to hold group information
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    if (groupId) {
      const db = getFirestore();
      const groupRef = doc(db, "groups", groupId);

      getDoc(groupRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setGroupInfo(snapshot.data());
          } else {
            console.error("Group not found in Firestore");
          }
        })
        .catch((error) => {
          console.error(
            "Error retrieving group information from Firestore:",
            error
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [groupId]);

  return (
    <div>
      {loading ? (
        <CircularProgress /> // Show a loading indicator while data is being fetched
      ) : groupInfo ? (
        <div>
          <h2>{groupInfo.title}</h2>
          <p>{groupInfo.description}</p>
          <p>Expiration Time: {groupInfo.expirationTime.toDate().toString()}</p>
          {/* You can display other group information here */}
        </div>
      ) : (
        <p>Group not found.</p>
      )}
    </div>
  );
}
