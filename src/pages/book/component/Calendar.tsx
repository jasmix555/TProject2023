import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import style from "@/styles/calendar.module.scss";
import { motion, useAnimation, AnimationControls } from "framer-motion"; // Import motion and useAnimation
import { isSameDay } from "date-fns";

const StyledCalendarContainer = styled.div`
  .react-calendar {
    position: absolute;
    bottom: 13rem;
    left: 50%;
    transform: translateX(-50%);
    width: 340px;
    height: 390px;
    font-size: 1.6rem;
    line-height: 2.6;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }

  .react-calendar__navigation {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .react-calendar__navigation button {
    min-width: 30px;
    background: none;
    border-radius: 1rem;
  }

  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #4eadfe;
  }

  //days wrapper
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
  }

  //days letter
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
    font-size: 1.2rem;
    font-weight: bold;
    color: #b9b9b9;
  }

  //neighboring month days number
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }

  //months wrapper
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2.8rem 0.5em;
    border-radius: 1rem;
  }

  .react-calendar__month-view__days__day {
    width: 4rem !important;
    padding: 0.1em;
  }

  .react-calendar__month-view__days__day abbr {
    display: inline-block;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  //tiles for everything
  .react-calendar__tile {
    border-radius: 50%;
    text-align: center;
    font: inherit;
    font-size: 1.6rem;
  }

  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #4eadfe;
  }

  //current day/month/year
  .react-calendar__tile--now {
    background: #2745e1;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--now {
    background: #2745e1;
  }

  .hasSaved {
    color: #ffbe15 !important;
  }
`;

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Message = {
  message?: string;
  timestamp: number;
  languages?: string;
  word?: string;
  meaning?: string;
  pronunciation?: string;
  genre?: string;
};

const containerVariants = {
  hidden: { y: "100%" },
  visible: { y: "0%" },
};

const DateInfo: React.FC<{
  date: Date | null;
  userId: string;
  onClose: () => void;
  controls: AnimationControls;
}> = ({ date, userId, onClose, controls }) => {
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch saved messages for the selected date
  const fetchSavedInfo = async (selectedDate: Date | null) => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userId);

      // Check if user document exists
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const dictionary = userData?.dictionary || [];

        // Filter messages for the selected date
        const messagesForDate: Message[] = dictionary.filter(
          (message: Message) => {
            // Convert timestamp to Date
            const messageDate = new Date(message.timestamp);
            return messageDate.toDateString() === selectedDate?.toDateString();
          }
        );

        setSavedMessages(messagesForDate);
      } else {
        console.error("User document not found for userId:", userId);
      }
    } catch (error) {
      console.error("Error fetching saved messages:", error);
    }
  };

  useEffect(() => {
    fetchSavedInfo(date);
  }, [date]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      // Close the DateInfo component only if the click is on the .wrapper itself
      onClose();
    }
  };

  useEffect(() => {
    controls.start("visible"); // Trigger the animation when the component mounts
  }, [controls]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={style.wrapper}
      onClick={handleClick}
    >
      <div className={style.container}>
        <FaTimes className={style.closeButton} onClick={onClose} />
        {isEditMode ? (
          <div>{/* Edit mode UI */}</div>
        ) : (
          <div className={style.messageWrapper}>
            {savedMessages.length > 0 ? (
              savedMessages.map((message, index) => (
                <div key={`SavedMessage_${index}`} className={style.messageBox}>
                  <div className={style.text}>
                    <div className={style.word}>
                      {message.word || message.message || "No Words"}
                    </div>
                    <div className={style.genre}>
                      [{message.genre || "ジャンル登録してません。"}]
                    </div>
                  </div>
                  <div className={style.pronunciation}>
                    {message.pronunciation || "読み方登録してません。"}
                  </div>
                  <div className={style.meaning}>
                    {message.meaning || "意味登録してません。"}
                  </div>
                </div>
              ))
            ) : (
              <p>冒険の記録はありません。</p>
            )}
            {/* <button onClick={handleEditClick}>Edit</button> */}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CalendarComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [value, onChange] = useState<Value>(new Date());
  const [savedDates, setSavedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const fetchDatesWithSavedMessages = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
        const userDoc = doc(usersCollection, userId);

        const userDocSnapshot = await getDoc(userDoc);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const dictionary = userData?.dictionary || [];

          // Find and log dates with saved messages
          const savedDatesArray = dictionary.map(
            (message: Message) => new Date(message.timestamp)
          );

          // Set the state with dates that have saved messages
          setSavedDates(savedDatesArray);
        } else {
          console.error("User document not found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching saved messages:", error);
      }
    };

    // Call the function to fetch and log dates with saved messages
    fetchDatesWithSavedMessages();
  }, [userId]); // Re-run when userId changes

  const handleClose = () => {
    setSelectedDate(null);
  };

  return (
    <StyledCalendarContainer>
      <Calendar
        maxDetail="month"
        onChange={onChange}
        onClickDay={(date) => {
          setSelectedDate(date);
          controls.start("visible");
        }}
        value={value}
        tileClassName={({ date, view }) =>
          savedDates.some((savedDate) => isSameDay(date, savedDate))
            ? "hasSaved"
            : ""
        }
      />
      {selectedDate && (
        <DateInfo
          date={selectedDate}
          userId={userId}
          onClose={handleClose}
          controls={controls}
        />
      )}
    </StyledCalendarContainer>
  );
};

export default CalendarComponent;
