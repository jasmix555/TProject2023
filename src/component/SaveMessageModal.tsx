import { motion } from "framer-motion";
import { MessageProps } from "@/pages/groupChat";

type SaveMessageModalProps = {
  selectedMessage: MessageProps;
  onClose: () => void;
  onSave: () => void;
  meaningInput: string;
  onMeaningInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SaveMessageModal: React.FC<SaveMessageModalProps> = ({
  selectedMessage,
  onClose,
  onSave,
  meaningInput,
  onMeaningInputChange,
}) => {
  const words = selectedMessage.message.split(/\s+/);

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Save Message</h2>
        <div>
          <p>Selected Words:</p>
          {words.map((word, index) => (
            <span
              key={index}
              onClick={() => console.log(`Selected word: ${word}`)}
            >
              {word}{" "}
            </span>
          ))}
        </div>
        <div>
          <label htmlFor="meaningInput">Meaning:</label>
          <input
            type="text"
            id="meaningInput"
            value={meaningInput}
            onChange={onMeaningInputChange}
          />
        </div>
        <button onClick={onSave}>Save</button>
      </div>
    </motion.div>
  );
};

export { SaveMessageModal };
